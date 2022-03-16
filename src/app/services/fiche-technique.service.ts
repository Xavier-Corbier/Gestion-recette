import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FicheTechnique} from "../models/fiche-technique";
import {StoreAppService} from "./store-app.service";
import {GlobalFicheTechnique} from "../models/global-fiche-technique";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {CategorieRecetteService} from "./categorie-recette.service";
import {ProgressionService} from "./progression.service";
import {Ingredient} from "../models/ingredient";

@Injectable({
  providedIn: 'root'
})
export class FicheTechniqueService {

  private ficheTechniqueCollection: AngularFirestoreCollection<FicheTechnique>;
  private queryFicheTech; // pour faire des requête complexes
  private path: string = "/fiche-techniques/";
  private nameCollection = 'fiche-techniques';

  constructor(
    private router: Router,
    private ficheTechStore: AngularFirestore,
    private categorieRecetteService : CategorieRecetteService,
    private storeApp: StoreAppService, // service qui contient les coùt / coef
    private progressionService : ProgressionService
  ) {
    this.ficheTechniqueCollection = ficheTechStore.collection(this.path);
    this.queryFicheTech = ficheTechStore.firestore;
  }

  /**
   * Fonction qui permet de créer une fiche technique dans la bd
   * @param fiche
   * @param createNewCategorie
   */
  createFicheTech(fiche: GlobalFicheTechnique, createNewCategorie : boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = this.ficheTechStore.createId();
      let sub: Subscription = this.ficheTechStore.doc(`fiche-techniques/${id}`).get().subscribe(doc => {
        // On regarde si une fiche technique à déjà cet id
        if (!doc.exists) {
          // sinon on l'ajoute
          const valeurs = JSON.parse(JSON.stringify(fiche));
          sub.unsubscribe(); // on arrête de suivre;
          this.ficheTechStore.doc(`fiche-techniques/${id}`).set(valeurs).then(
            () => {
              if(createNewCategorie){
                this.categorieRecetteService.addNewCategorie(fiche.header.categorie).then(()=>{
                  resolve("Vos données sont sauvegardé");
                }).catch(()=>{
                  reject("Vos données sont sauvegardé mais il y a eu un problème avec les catégories")
                })
              }else{
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
    })
  }


  /**
   * Fonction qui permet de transformer un objet any de la bd en objet GlobalFicheTechnique
   * @param doc
   * @param withProgression
   */
  doc2Fiche(doc: any, withProgression: boolean = false): GlobalFicheTechnique {
    const header = doc.header;
    return new GlobalFicheTechnique(
      new FicheTechnique(
        header.nomPlat,
        header.nomAuteur,
        header.nbrCouvert,
        header.isCalculCharge,
        header.coutMatiere,
        header.dureeTotal,
        header.coutMoyenHorraire,
        header.coutForfaitaire,
        header.coefCoutProduction,
        header.coefPrixDeVente,
        doc.uid,
        header.categorie
      ),
      withProgression ? this.progressionService.doc2Progression(doc.progression) : [],
      doc.materielSpecifique,
      doc.materielDressage
    )
  }

  /**
   * Get une fiche technique dans la BD
   * @param id
   */
  getFicheTechnique(id : string) : Observable<GlobalFicheTechnique> {
    if(id === undefined){
      return new Observable<GlobalFicheTechnique>();
    }
    else{
      var itemDoc = this.ficheTechStore.doc<GlobalFicheTechnique>(this.path+ id);
      return itemDoc.valueChanges({ idField: "uid" }).pipe(
        map( fiche => this.doc2Fiche(fiche,true))
      );
    }
  }

  /**
   * Récupère toutes les fiches techniques de la base de données
   * @param withProgression
   */
  getAllFichesTechnique( withProgression: boolean = false): Observable<GlobalFicheTechnique[]> {
    return this.ficheTechniqueCollection.valueChanges({idField: "uid"}).pipe(
      map(data => data.map(doc => this.doc2Fiche(doc,withProgression)))
    );
  }

  /**
   * Récupère tous les noms des fiches techniques de la base de données
   * @PostCondition : aucune fiche technique ne contient de sous-fiche technique en étape
   */
  getAllNameFichesTechnique() : Observable<{nom : string, id : string}[]>{
    function neContientPasDeSousFicheTechnique(docF : any) : boolean{
      let bool : boolean = true;
      docF.progression.forEach((etapeFiche : any) =>{
        if(etapeFiche.identification !== undefined){
          bool =  false;
        }
      });
      return bool;
    }

    return this.ficheTechniqueCollection.valueChanges({idField: "uid"}).pipe(
      map(data => data.filter((docF : any) => neContientPasDeSousFicheTechnique(docF)).map((doc : any) => {
          return {nom : doc.header.nomPlat, id : doc.uid}
      }))
    );
  }

  /**
   * Modifie une fiche technique dans la base de données
   * @param ficheTechnique
   * @param createNewCategorie
   */
  updateFicheTech(ficheTechnique : GlobalFicheTechnique, createNewCategorie : boolean = false) : Promise<string>{
    return new Promise((resolve, reject) => {
      const id = ficheTechnique.header.idFicheTechnique;
      delete ficheTechnique.header.idFicheTechnique;
      const valeur = JSON.parse(JSON.stringify(ficheTechnique));
      if(createNewCategorie){
        this.checkIfDeleteCategorieRecette(id!).then(()=>{ // on vérifie si on supprime l'ancienne catégorie
          this.ficheTechniqueCollection.doc(id).set(valeur).then(
            () => {
              this.categorieRecetteService.addNewCategorie(ficheTechnique.header.categorie).then(() => {
                resolve("Vos données sont sauvegardé");
              }).catch((error)=>{
                reject("Vos données sont sauvegardé mais il y a eu un problème avec les catégories")
              })
            })
        }).catch((error)=>{
          reject("Vos données sont sauvegardé mais il y a eu un problème avec les catégories")
        })
      }
      else{
        this.ficheTechniqueCollection.doc(id).set(valeur).then(
          () => {
            resolve("Vos données sont sauvegardé");
          }).catch((error) => {
          reject("Vos données ne sont pas sauvegardées");
        });
      }
    })
  }


  /**
   * Supprime une fiche technique dans la base de données
   * @param uid
   */
  deleteFicheTech(uid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.checkIfDeleteCategorieRecette(uid).then(() => {
        this.ficheTechStore.doc<GlobalFicheTechnique>(this.path + uid).delete().then(
          () => {
            resolve("La fiche technique à bien été supprimé");
          }).catch(
          (error) => {
            reject("Il y a eu un problème lors de la suppresion de la fiche technique");
          })
      }).catch(
        (error) => {
          reject("Il y a eu un problème lors de la suppresion de la fiche technique");
        })
    })
  }

  /**
   * Met a jour l'ingrédient dans toutes les fiches techniques
   * @param ingredient ingredient
   */
  updateIngredientInFT(ingredient: Ingredient){
    let subscribre = this.getAllFichesTechnique(true).subscribe(
      (list)=>{
        subscribre.unsubscribe();
        list.map((fiche)=>{
          if(fiche.isContientIngredient(ingredient)) { // s'il contient l'ingrédient, il le met à jour et recacule ses coûts
            this.updateFicheTech(fiche);
          }
        })
      }
    )
  }

  /**
   * Regarde si une catégorie est vide, si c'est le cas elle la supprime
   * @param uid
   */
  checkIfDeleteCategorieRecette(uid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let sub: Subscription = this.getFicheTechnique(uid).subscribe((doc : GlobalFicheTechnique) => {
        let nomCategorie = doc.header.categorie;
        sub.unsubscribe();
        this.queryFicheTech.collection(this.nameCollection).where("header.categorie", "==", nomCategorie).get().then((fiches) => {
          if (fiches.size == 1) {
            this.categorieRecetteService.deleteCategorieRecette(nomCategorie).then(() => {
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
