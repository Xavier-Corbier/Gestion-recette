import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Ingredient} from "../models/ingredient";
import {Etiquette} from "../models/etiquette";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour maintenir les étiquettes
 */
export class EtiquetteService {
  private path = '/etiquettes/';
  private etiquetteStore: AngularFirestore;
  private etiquetteCollection: AngularFirestoreCollection<Etiquette>;
  constructor(private afDb: AngularFirestore,)
  {
    this.etiquetteStore = afDb;
    this.etiquetteCollection = afDb.collection(this.path);
  }

  /**
   * Ajout d'une nouvelle étiquette
   * @param etiquette
   */
  addNewEtiquette(etiquette: Etiquette) : Promise<string> {
    return new Promise((resolve, reject) => {
      const id = this.etiquetteStore.createId();
      let sub: Subscription = this.etiquetteStore.doc(this.path+ id).get().subscribe(doc => {
        // On regarde si une étiquette à déjà cet id
        if (!doc.exists) {
          // sinon on l'ajoute
          let valeur = Object.assign({}, etiquette)
          delete valeur.idEtiquette
          sub.unsubscribe(); // on arrête de suivre;
          this.etiquetteStore.doc(this.path+ id).set(valeur).then(
            () => {
              resolve(id);
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
}
