import { Injectable } from '@angular/core';
import {Description} from "../models/description";

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  constructor() { }

  /**
   * Converti l'objet description de la base de données en objet du modèle Description
   * @param doc
   */
  doc2Description(doc : any) : Description{
    return new Description(doc.nom,doc.description,doc.tempsPreparation);
  }
}
