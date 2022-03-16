import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Ingredient} from "../models/ingredient";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {CategorieIngredientService} from "./categorie-ingredient.service";
import {FicheTechniqueService} from "./fiche-technique.service";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour maintenir les ingrédients dans la base de données
 */
export class IngredientService {
  private path = '/ingredients/';
  private nameCollection = 'ingredients';
  private ingredientStore: AngularFirestore;
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;
  private queryIngredient;

  constructor(private afDb: AngularFirestore,
              private categorieIngredientService: CategorieIngredientService,
              private ficheTechniqeService : FicheTechniqueService) {
    this.ingredientStore = afDb;
    this.ingredientCollection = afDb.collection(this.path);
    this.queryIngredient = afDb.firestore;
  }

  /**
   * Transforme un objet en Ingredient
   * @param doc
   * @return Ingredient
   */
  doc2Ingredient(doc:any) : Ingredient{
    return new Ingredient(doc.nomIngredient,doc.qteIngredient,doc.prixUnitaire,doc.unite,doc.categorie,doc.listAllergene,doc.idIngredient)
  }

  /**
   * Get tout les ingrédients
   */
  getAllIngredients(): Observable<Ingredient[]> {
    return this.ingredientCollection.valueChanges({ idField: "idIngredient" }).pipe(
      map(data => data.map(doc => this.doc2Ingredient(doc)))
    );
  }

  /**
   * Delete un ingrédient avec son identifiant
   * @param id
   */
  deleteIngredient(id : string) :  Promise<string> {
    return new Promise((resolve,reject)=>{
      this.checkIfDeleteCategorieIngredient(id).then(()=> {
        this.ingredientStore.doc<Ingredient>(this.path+id).delete().then(
        ( )=>{
          resolve("L'ingrédient à bien été supprimé");
        }).catch(
        (error) =>{
          reject("Il y a eu un problème lors de la suppresion de l'ingrédient");
        })
      }).catch(
      (error) =>{
        reject("Il y a eu un problème lors de la suppresion de l'ingrédient");
      })
    })
  }

  /**
   * Récupère un ingrédient avec son identifiant
   * @param id
   */
  getIngredient(id : string) : Observable<Ingredient> {
    var itemDoc = this.ingredientStore.doc<Ingredient>(this.path+ id);
    return itemDoc.valueChanges({ idField: "idIngredient" }).pipe(
      map( ingredient => this.doc2Ingredient(ingredient))
    );
  }

  /**
   * Ajout d'un nouveau ingrédient
   * @param ingredient
   * @param createNewCategorie
   */
  addNewIngredient(ingredient: Ingredient, createNewCategorie : boolean) : Promise<string> {
    return new Promise((resolve, reject) => {
      const id = this.ingredientStore.createId();
      this.checkfSiUnIngredientADejaLeNom(ingredient.nomIngredient).then(() => {
        let sub: Subscription = this.ingredientStore.doc(this.path + id).get().subscribe(doc => {
          // On regarde si un ingrédient à déjà cet id
          if (!doc.exists) {
            // sinon on l'ajoute
            let valeur = Object.assign({}, ingredient)
            delete valeur.idIngredient
            sub.unsubscribe(); // on arrête de suivre;
            this.ingredientStore.doc(this.path + id).set(valeur).then(
              () => {
                if (createNewCategorie) {
                  this.categorieIngredientService.addNewCategorie(ingredient.categorie).then(() => {
                    resolve("Vos données sont sauvegardé");
                  })
                } else {
                  resolve("Vos données sont sauvegardé");
                }
              }).catch((error) => {
                reject("Vos données ne sont pas sauvegardées");
              }
            )
          } else {
            reject("Vos données ne sont pas sauvegardées");
          }
        })
      }).catch(()=>{
        reject("Un ingrédient possède déjà ce nom");
      })
    })
  }

  /**
   * Mise à jour d'un ingrédient
   * @param ingredient
   * @param createNewCategorie
   */
  updateIngredient(ingredient: Ingredient, createNewCategorie : boolean) : Promise<string> {
    return new Promise((resolve, reject) => {
      const id = ingredient.idIngredient;
      let valeur = Object.assign({}, ingredient)
      delete valeur.idIngredient
      this.ingredientCollection.doc(id).set(valeur).then(
        () => {
          ingredient.setId(id!);
          this.ficheTechniqeService.updateIngredientInFT(ingredient) // met à jour les fiches techniques qui utilise l'ingrédient
          if(createNewCategorie){
            this.categorieIngredientService.addNewCategorie(ingredient.categorie).then(() => {
              resolve("Vos données sont sauvegardé");
            })
          } else {
            resolve("Vos données sont sauvegardé");
          }
        }).catch((error) => {
          reject("Vos données ne sont pas sauvegardées");
        }
      );
    })
  }

  /**
   * Ajout d'un allergene dans un ingredient
   * @param allergene
   * @param nomIngredient
   */
  addAllergeneToIngredient(allergene : string, nomIngredient: string) : Promise<string>{
    return new Promise((resolve, reject) => {
      this.queryIngredient.collection(this.nameCollection).where("nomIngredient","==",nomIngredient).get().then((ingredients) => {
        ingredients.forEach((ingredient) => {
          let ingredientGet = this.doc2Ingredient(ingredient.data());
          ingredientGet.listAllergene.push(allergene);
          ingredientGet.idIngredient = ingredient.id
          this.updateIngredient(ingredientGet, false).then(
            () => {
              resolve("Vos données sont sauvegardé");
            }).catch((error) => {
              reject("Vos données ne sont pas sauvegardées");
            }
          );
        })
      })
    })
  }

  /**
   * Mise à jour de la liste des allergenes d'un ingrédient
   * @param allergeneOld
   * @param allergeneNew
   * @param nomIngredient
   */
  updateAllergeneToIngredient(allergeneOld : string, allergeneNew : string, nomIngredient: string) : Promise<string>{
    return new Promise((resolve, reject) => {
      this.queryIngredient.collection(this.nameCollection).where("nomIngredient","==",nomIngredient).get().then((ingredients) => {
        ingredients.forEach((ingredient) => {
          let ingredientGet = this.doc2Ingredient(ingredient.data());
          const index = ingredientGet.listAllergene.indexOf(allergeneOld);
          if (index > -1) {
            ingredientGet.listAllergene.splice(index, 1);
          }
          ingredientGet.listAllergene.push(allergeneNew);
          ingredientGet.idIngredient = ingredient.id
          this.updateIngredient(ingredientGet, false).then(
            () => {
              resolve("Vos données sont sauvegardé");
            }).catch((error) => {
              reject("Vos données ne sont pas sauvegardées");
            }
          );
        })
      })
    })
  }

  /**
   * Supprime un allergene de la list d'allergene d'un ingredient
   * @param allergeneOld
   * @param nomIngredient
   */
  removeAllergeneToIngredient(allergeneOld : string,  nomIngredient: string) : Promise<string>{
    return new Promise((resolve, reject) => {
      this.queryIngredient.collection(this.nameCollection).where("nomIngredient","==",nomIngredient).get().then((ingredients) => {
        ingredients.forEach((ingredient) => {
          let ingredientGet = this.doc2Ingredient(ingredient.data());
          const index = ingredientGet.listAllergene.indexOf(allergeneOld);
          if (index > -1) {
            ingredientGet.listAllergene.splice(index, 1);
          }
          ingredientGet.idIngredient = ingredient.id
          this.updateIngredient(ingredientGet, false).then(
            () => {
              resolve("Vos données sont sauvegardé");
            }).catch((error) => {
              reject("Vos données ne sont pas sauvegardées");
            }
          );
        })
      })
    })
  }

  /**
   * Regarde si un ingrédient à déjà ce nom
   * @return true si aucuns ingrédients ne possède ce nom, false sinon
   * @param nomIngredient
   */
  checkfSiUnIngredientADejaLeNom(nomIngredient:string):Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.queryIngredient.collection(this.nameCollection).where("nomIngredient", "==", nomIngredient).get().then((ingredients) => {
        if (ingredients.size == 0) {
          resolve(true);
        } else {
          reject(false);
        }
      })
      .catch((error)=>{
        reject(false);
      })
    });
  }

  /**
   * Vérifie si une catégorie est vide. Si oui, on l'a supprime
   * @param idIngredient
   */
  checkIfDeleteCategorieIngredient(idIngredient : string) : Promise<string>{
    return new Promise((resolve, reject) => {
      let sub: Subscription = this.getIngredient(idIngredient).subscribe(doc => {
        let nomCategorie = doc.categorie;
        sub.unsubscribe();
        this.queryIngredient.collection(this.nameCollection).where("categorie","==",nomCategorie).get().then((ingredients) => {
          if(ingredients.size<=1){
            this.categorieIngredientService.deleteCategorieIngredient(nomCategorie).then(() => {
              resolve("Vos données sont sauvegardé");
            }).catch((error) => {
              reject("Vos données ne sont pas sauvegardées");
            })
          } else {
            resolve("Vos données sont sauvegardé");
          }
        })
      })
    })
  }
}
