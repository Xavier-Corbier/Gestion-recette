import { Injectable } from '@angular/core';
import {Allergène} from "../models/allergène";
import {Observable, Subscription} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Ingredient} from "../models/ingredient";
import {map} from "rxjs/operators";
import {IngredientService} from "./ingredient.service";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour gérer un Allergene dans la base de données
 */
export class AllergèneService {
  private path = '/allergenes/';
  private pathIngredient = '/ingredients/';
  private nameCollection = 'allergenes';
  private nameCollectionIngredient = 'ingredients';
  private allergeneStore: AngularFirestore;
  private allergeneCollection: AngularFirestoreCollection<Allergène>;
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;

  constructor(private afDb: AngularFirestore,
              private ingredientService: IngredientService,) {
    this.allergeneStore = afDb;
    this.allergeneCollection = afDb.collection(this.path);
    this.ingredientCollection =afDb.collection(this.pathIngredient)
  }

  /**
   * Transforme un objet en Allergene
   * @param doc
   * @return Allergène
   */
  doc2Allergene(doc:any) : Allergène{
    return new Allergène(doc.nom,[],doc.id)
  }

  /**
   * Recupère un allergene
   * @param id
   */
  getAllergene(id : string) : Observable<Allergène> {
    var itemDoc = this.allergeneStore.doc<Allergène>(this.path+ id);
    return itemDoc.valueChanges({ idField: "id" }).pipe(
      map( allergene => this.doc2Allergene(allergene))
    );
  }

  /**
   * Recupère tout les allergenes
   */
  getAllAllergenes(): Observable<Allergène[]> {
    return this.allergeneCollection
      .valueChanges({idField: "id"}).pipe(
        map(data => {
          return data.map(doc => this.doc2Allergene(doc));
        })
      );
  }

  /**
   * Ajout un nouveau allergene
   * @param allergene
   */
  addNewAllergene(allergene: Allergène) : Promise<string> {
    return new Promise((resolve, reject) => {
      const id = this.allergeneStore.createId();
      let sub: Subscription = this.allergeneStore.doc(this.path+id).get().subscribe(doc => {
        // On regarde si un ingrédient à déjà cet id
        if (!doc.exists) {
          // sinon on l'ajoute
          this.addAllergeneToIngredient(allergene)
          let valeur = Object.assign({}, allergene)
          delete valeur.listIngredient;
          delete valeur.id
          sub.unsubscribe(); // on arrête de suivre;
          this.allergeneStore.doc(this.path+id).set(valeur).then(
          () => {
            resolve("Vos données sont sauvegardé");
          }).catch((error) => {
            reject("Vos données ne sont pas sauvegardées");
          })
        } else {
          reject("Vos données ne sont pas sauvegardées");
        }
      })
    })
  }

  /**
   * Supprime un allergene avec son identifiant
   * @param id
   */
  deleteAllergene(id : string) :  Promise<string> {
    return new Promise((resolve,reject)=>{
      this.allergeneStore.doc<Ingredient>(this.path+id).delete().then(
      ( )=>{
        resolve("L'allergène à bien été supprimé");
      }).catch(
      (error) =>{
        reject("Il y a eu un problème lors de la suppresion de l'allergène");
      })
    })
  }

  /**
   * Mise à jour d'un ingrédient
   * @param allergène
   */
  updateAllergene(allergène: Allergène) : Promise<string> {
    return new Promise((resolve, reject) => {
      const id = allergène.id;
      this.updateAllergeneToIngredient(allergène)
      let valeur = Object.assign({}, allergène)
      delete valeur.listIngredient;
      delete valeur.id
      this.allergeneCollection.doc(id).set(valeur).then(
      () => {
        resolve("Vos données sont sauvegardé");
      }).catch((error) => {
        reject("Vos données ne sont pas sauvegardées");
      });
    })
  }

  /**
   * Ajout un allergene à un ingrédient
   * @param allergene
   */
  addAllergeneToIngredient(allergene : Allergène){
    allergene.listIngredient?.forEach((nomIngredient) => {
      this.ingredientService.addAllergeneToIngredient(allergene.nom,nomIngredient)
    })
  }

  /**
   * Mise à jour d'un allergene dans un ingrédient
   * @param allergene
   */
  updateAllergeneToIngredient(allergene : Allergène){
    this.allergeneStore.firestore.collection(this.nameCollectionIngredient).get().then((ingredientsDoc) => {
      let ingredients : Ingredient[] = []
      ingredientsDoc.forEach((doc) => {
        ingredients.push(this.ingredientService.doc2Ingredient(doc.data()))
      })
      this.allergeneStore.firestore.collection(this.nameCollection).doc(allergene.id).get().then((allergeneOldDoc) => {
        let allergeneOld : Allergène = this.doc2Allergene(allergeneOldDoc.data())
        ingredients.forEach((ingredient : Ingredient) => {
            if(allergene.listIngredient?.includes(ingredient.nomIngredient)){
              this.ingredientService.updateAllergeneToIngredient(allergeneOldDoc.data()!.nom,allergene.nom,ingredient.nomIngredient)
            } else {
              this.ingredientService.removeAllergeneToIngredient(allergeneOldDoc.data()!.nom,ingredient.nomIngredient)
            }
        })
      })
    })
  }
}
