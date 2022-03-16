import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {CategorieRecette} from "../models/categorie-recette";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CategorieRecetteService {
  private path = '/categories-recettes/';
  private nameCollection = 'categories-recettes';
  private recetteStore: AngularFirestore;
  private recetteCollection: AngularFirestoreCollection<CategorieRecette>;
  private queryRecette;

  constructor(private afDb: AngularFirestore) {
    this.recetteStore = afDb;
    this.recetteCollection = afDb.collection(this.path);
    this.queryRecette = afDb.firestore;
  }

  /**
   * Transforme un objet any en un objet categorieRecette
   * @param doc
   * @return CategorieRecette
   */
  doc2CategorieRecette(doc:any) : CategorieRecette{
    return new CategorieRecette(doc.nomCategorie)
  }

  /**
   * Get toutes les catégories des recettes de la BD
   */
  getAllCategorieRecettes(): Observable<CategorieRecette[]> {
    return this.recetteCollection.valueChanges({ idField: "idCategorieRecette" }).pipe(
      map(data => data.map(doc => this.doc2CategorieRecette(doc)))
    );
  }

  /**
   * Ajouter une nouvelle catégorie dans la BD
   * @param nom
   */
  addNewCategorie(nom : string){
    return new Promise(
      (resolve, reject)=>{
        const id : string  = this.recetteStore.createId()
        let sub : Subscription = this.recetteStore.doc(this.path+id).get().subscribe(doc=>{
          if(!doc.exists){
            const newRecetteCategorie = new CategorieRecette(nom);
            this.recetteStore.doc(this.path+id).set(Object.assign({},newRecetteCategorie))
            sub.unsubscribe(); // on arrête de suivre;
            resolve("Catégorié créé !");
          }
          else{
            reject("Catégorie déjà présente.");
          }
        })
      });
  }

  /**
   * Supprime une catégorie dans la BD
   * @param nomCategorie
   */
  deleteCategorieRecette(nomCategorie : string) :  Promise<string> {
    return new Promise((resolve,reject)=>{
      this.queryRecette.collection(this.nameCollection).where("nomCategorie","==",nomCategorie).get().then((categories) => {
        categories.forEach((categorie) => {
          this.recetteStore.doc<CategorieRecette>(this.path+categorie.id).delete().then(
            ( )=>{
              resolve("La categorie à bien été supprimé");
            }
          ).catch(
            () =>{
              reject("Il y a eu un problème lors de la suppresion de la categorie");
            }
          )
        })
      })
    })
  }



}
