import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Etiquette} from "../models/etiquette";
import {Subscription} from "rxjs";
import {Vente} from "../models/vente";
import {Denree} from "../models/denree";
import {Ingredient} from "../models/ingredient";
import {IngredientService} from "./ingredient.service";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour permettre les ventes dans la base de données
 */
export class VenteService {
  private path = '/ventes/';
  private venteStore: AngularFirestore;
  private venteCollection: AngularFirestoreCollection<Vente>;
  constructor(private afDb: AngularFirestore,
              private ingredientService : IngredientService)
  {
    this.venteStore = afDb;
    this.venteCollection = afDb.collection(this.path);
  }

  /**
   * Ajout d'une nouvelle vente
   * @param vente
   */
  addNewVente(vente: Vente) : Promise<string> {
    return new Promise((resolve, reject) => {
      const id = this.venteStore.createId();
      let sub: Subscription = this.venteStore.doc(this.path+ id).get().subscribe(doc => {
        // On regarde si une vente à déjà cet id
        if (!doc.exists) {
          // sinon on l'ajoute
          let valeur = Object.assign({}, vente)
          sub.unsubscribe(); // on arrête de suivre;
          this.venteStore.doc(this.path+ id).set(valeur).then(
            () => {
              resolve("Vos données sont sauvegardées");
            }).catch((error) => {
              reject("Vos données ne sont pas sauvegardées");
            }
          )
        } else {
          reject("Vos données ne sont pas sauvegardées");
        }
      })
    })
  }

  /**
   * Mise à jour du stock d'un ingrédient
   * @param listDenree
   * @param number
   * @param nombreCouvert
   */
  updateStock(listDenree : Denree[], number : number, nombreCouvert: number) : Promise<string>{
    return new Promise((resolve, reject) => {
      for(let i = 0 ; i< listDenree.length ; i++){
        let ingredient : Ingredient = listDenree[i].ingredient;
        let sub: Subscription = this.venteStore.doc('/ingredients/'+ingredient.idIngredient).get().subscribe(doc => {
            // On regarde si un ingrédient à déjà cet id
            if (doc.exists) {
              let newIngredient : Ingredient = this.ingredientService.doc2Ingredient(doc.data())
              newIngredient.idIngredient=ingredient.idIngredient
              newIngredient.qteIngredient-=(listDenree[i].number/nombreCouvert)*number;
              this.ingredientService.updateIngredient(newIngredient,false).catch(()=>{
                reject("Erreur dans las base de données")
              })
            }
        })
      }
      resolve("Vos données sont sauvegardé");
    })
  }
}
