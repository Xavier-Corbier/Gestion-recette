import { Injectable } from '@angular/core';
import {StoreApp} from "../models/store-app";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour maintenir le store dans la base de données
 */
export class StoreAppService {
  private path = '/preferences/';
  private id = 'store';
  private preferenceStore: AngularFirestore;
  private preferenceCollection: AngularFirestoreCollection<StoreApp>;

  constructor(private afDb: AngularFirestore) {
    this.preferenceStore = afDb;
    this.preferenceCollection = afDb.collection(this.path);
  }

  /**
   * Transforme un objet en StoreApp
   * @param doc
   * @return StoreApp
   */
  doc2StoreApp(doc: any): StoreApp {
    return new StoreApp(doc.coûtMoyen, doc.coûtForfaitaire, doc.coefPrixDeVente, doc.coefCoûtProduction)
  }

  /**
   * Récupère le store courrant
   * @return Observable<StoreApp>
   */
  getStore(): Observable<StoreApp> {
    let itemDoc = this.preferenceStore.doc<StoreApp>(this.path + this.id);
    return itemDoc.valueChanges().pipe(
      map(doc => this.doc2StoreApp(doc))
    );
  }

  /**
   * Mise à jour du store courrant
   * @param store
   * @return Promise<void>
   */
  updateStore(store: StoreApp) : Promise<void>{
    return this.preferenceCollection.doc(this.id).set(Object.assign({}, store));
  }
}
