import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Ingredient} from "../models/ingredient";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {CategorieIngredient} from "../models/categorie-ingredient";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour maintenir la catégorie d'un ingrédient dans la base de données
 */
export class CategorieIngredientService {
  private path = '/categories-ingrédients/';
  private nameCollection = 'categories-ingrédients';
  private ingredientStore: AngularFirestore;
  private ingredientCollection: AngularFirestoreCollection<CategorieIngredient>;
  private queryIngredient;

  constructor(private afDb: AngularFirestore) {
    this.ingredientStore = afDb;
    this.ingredientCollection = afDb.collection(this.path);
    this.queryIngredient = afDb.firestore;

  }

  /**
   * Transforme un objet en CategorieIngredient
   * @param doc
   * @return CategorieIngredient
   */
  doc2CategorieIngredient(doc:any) : CategorieIngredient{
    return new CategorieIngredient(doc.nomCategorie)
  }

  /**
   * Get toutes les catégories d'ingredient
   */
  getAllCategorieIngredients(): Observable<CategorieIngredient[]> {
    return this.ingredientCollection.valueChanges({ idField: "idIngredient" }).pipe(
      map(data => data.map(doc => this.doc2CategorieIngredient(doc)))
    );
  }

  /**
   * Ajout d'une nouvelle catégorie
   * @param nom
   */
  addNewCategorie(nom : string){
    return new Promise(
      (resolve, reject)=>{
        const id : string  = this.ingredientStore.createId()
        let sub : Subscription = this.ingredientStore.doc(this.path+id).get().subscribe(doc=>{
          if(!doc.exists){
            const newIngredientCategorie = new CategorieIngredient(nom);
            this.ingredientStore.doc(this.path+id).set(Object.assign({},newIngredientCategorie))
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
   * Supprime une catégorie
   * @param nomCategorie
   */
  deleteCategorieIngredient(nomCategorie : string) :  Promise<string> {
    return new Promise((resolve,reject)=>{
      this.queryIngredient.collection(this.nameCollection).where("nomCategorie","==",nomCategorie).get().then((categories) => {
        categories.forEach((categorie) => {
          this.ingredientStore.doc<Ingredient>(this.path+categorie.id).delete().then(
            ( )=>{
              resolve("La categorie à bien été supprimé");
            }
          ).catch(
            (error) =>{
              reject("Il y a eu un problème lors de la suppresion de la categorie");
            }
          )
        })
      })
    })
  }
}
