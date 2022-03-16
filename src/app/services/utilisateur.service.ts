import {Injectable} from '@angular/core';
import {Utilisateur} from "../models/utilisateur";

import {Router} from "@angular/router";

import {Observable, Subject, Subscription} from "rxjs";

import {map} from "rxjs/operators";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";


// TODO Documentation requête : https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-8_5

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private path = '/users/';
  private pathQuery = "users";
  private userCollection: AngularFirestoreCollection<Utilisateur>
  private queryUser; // Permet de faire des requêtes complexes
  currentUserSubject = new Subject<Utilisateur|undefined>(); // utilisateur que les autres components écoutent
  private currentUser? : Utilisateur = undefined;



  constructor(private router : Router,
              private userStore: AngularFirestore
  ){
    this.userCollection = userStore.collection(this.path);
    this.queryUser = userStore.firestore;
  }

  /**
   * Fonction qui permet de mettre à jour l'user émit aux components qui écoute (// pattern observer)
   */
  emitCurrentUser(){
    this.currentUserSubject.next(this.currentUser);
  }

  /**
   * Fonction qui transforme une utilisateur récupérer dans la bd en objet Utilisateur
   * @param doc
   * @param withMdp
   */
  doc2Utilisateur(doc:any, withMdp = false) : Utilisateur{
    const user = new Utilisateur(doc.uid,doc.nom,doc.prenom,doc.email,doc.estAdmin)
    if(withMdp){
      user.setMdp(doc.motdepasse);
    }
    return user
  }

  /**
   * Récupère l'abonnement à l'utilisateur qui permet de savoir son état en temps réel
   */
  getCurrentUser() : Subject<Utilisateur|undefined>{
    return this.currentUserSubject;
  }

  /**
   * Supprime un utilisateur avec son id
   * @param uid
   */
  deleteUtilisateur(uid : string ){
    this.userStore.doc<Utilisateur>(this.path+uid).delete();
  }

  /**
   * Récupère tous les utilisateurs de la bd
   */
  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.userCollection.valueChanges({ idField: "uid" }).pipe(
      map(data => data.map(doc => this.doc2Utilisateur(doc)))
    );
  }

  /**
   * Récupère un utilisateur dans la bd grâce à son id
   * @param id
   */
  getUtilisateur(id : string) : Observable<Utilisateur> {
    var itemDoc = this.userStore.doc<Utilisateur>(this.path+ id);
    return itemDoc.valueChanges({ idField: "uid" }).pipe(
      map( user => this.doc2Utilisateur(user))
    );
  }

  /**
   * Modifie un utilisateur
   * @param user
   * @param nom
   * @param prenom
   */
  updateUtilisateur(user: Utilisateur, nom : string, prenom : string) : boolean{
    if (user.uid == null) {
      return false;
    }
    user!.nom = nom;
    user!.prenom = prenom;
    this.userCollection.doc(user.uid).set(Object.assign({}, user));
    return true;
  }

  /**
   * Création d'un nouvel utilisateur
   * @param nom
   * @param prenom
   * @param email
   * @param password
   */
  createNewUser(nom : string, prenom: string,email:string, password:string){
    return new Promise(
      (resolve, reject)=>{
        const id : string  = this.userStore.createId()
        let sub : Subscription = this.userStore.doc(`users/${id}`).get().subscribe(doc=>{
            if(!doc.exists){
              const newUser = new Utilisateur(id,nom,prenom,email,false);
              newUser.setMdp(password);
              this.userStore.doc(`users/${id}`).set(Object.assign({},newUser))
              sub.unsubscribe(); // on arrête de suivre;
              resolve("Utilisateur créé !");
            }
            else{
              reject("id d'utilisateur déjà présent.");
            }
          })
        });
  }


  /**
   * Fonction qui permet la connexion d'un utilisateur
   * @param email
   * @param password
   */
  login(email:string, password:string){
    return new Promise(
      (resolve, reject)=>{
        this.queryUser.collection(this.pathQuery).where("email","==",email).get().then(
          (querySnapshot) => {
            querySnapshot.forEach((doc) =>{
              if(doc.exists) {
                this.currentUser = this.doc2Utilisateur(doc.data(),true);
                if(this.currentUser.motdepasse == password){
                  this.emitCurrentUser(); // on met à jours pour les subscribers
                  sessionStorage.setItem("userId", this.currentUser!.uid);
                  resolve(true);
                }
                else{
                  reject("Mauvais mdp")
                }
              }
              else{
                reject("Pas d'utilisateur avec cette email et/ou ce mdp");
              }
            })
            reject("Pas d'utilisateur avec cette email et/ou ce mdp");
          }
        ).catch(
          (error)=>{
            reject(error);
          }
        )
      }
    )
  }

  /**
   * Regarde si l'utilisateur était déjç connecté avant (sessionStorage)
   */
  checkSessionStorage() : boolean{
      const uid = sessionStorage.getItem('userId');
      if(uid){ // exist
        let sub = this.getUtilisateur(uid).subscribe((user)=>{
          sub.unsubscribe();
          if(user){ // found in the db
            this.currentUser = user; // set the user
            this.emitCurrentUser(); // on met à jours pour les subscribers
            return true;
          }
          return false;
        })
      }
      return false;
  }

  /**
   * Fonction appellé par la guard pour savoir directement si un utilisateur etait déjà connecté avant le rechargement de la page
   * Si c'est le cas, on return true, et si un utilisateur est déjà présent on emit sa valeur pour qu'il la reçoive
   */
  checkRechargePageGuard() : boolean{
    if(sessionStorage.getItem('userId') && this.currentUser == undefined){ // on doit attendre l'emit de la fonction checkSessionsStorage
      return true;
    }else{ // Pas d'utilisateur précédement connecté où la page ne vient pas de recharger, on doit emit pour la guard.
      this.emitCurrentUser();
      return false;
    }
  }

  /**
   * Fonction qui permet la déconnexion de l'utilisateur
   */
  deconnexion(){
    this.currentUser = undefined;
    this.emitCurrentUser(); // on met à jours pour les subscribers
    sessionStorage.clear();
    this.router.navigate(["/"])
  }




}
