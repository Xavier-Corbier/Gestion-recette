import { Injectable } from '@angular/core';
import {EtapeList_Fiche} from "../models/global-fiche-technique";
import {EtapeService} from "./etape.service";

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {

  constructor(
    private etapeService : EtapeService
  ) { }

  /**
   * Converti l'objet progression de la base de données en objet du modèle Progression
   * @param doc
   */
  doc2Progression(doc : any) : EtapeList_Fiche[]{
    let etapesFiche : EtapeList_Fiche[] = [];
    doc.forEach((etape : EtapeList_Fiche)=>{
      etapesFiche.push(new EtapeList_Fiche(this.etapeService.doc2Etape(etape.etapes),etape.identification));
    })
    return etapesFiche;
  }

}
