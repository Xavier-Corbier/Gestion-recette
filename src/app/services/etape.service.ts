import { Injectable } from '@angular/core';
import {Etape} from "../models/etape";
import {DescriptionService} from "./description.service";
import {DenreeService} from "./denree.service";

@Injectable({
  providedIn: 'root'
})
export class EtapeService {

  constructor(
    private descService : DescriptionService,
    private denreeService : DenreeService
  ) { }

  /**
   * Converti l'objet etape de la base de données en objet du modèle Etape
   * @param doc
   */
  doc2Etape(doc : any) : Etape[]{
    let etapes: Etape[] = [];
    doc.forEach((etape : Etape)=>{
      etapes.push(new Etape(this.descService.doc2Description(etape.identification), this.denreeService.doc2Denree(etape.contenu)))
    })
    return etapes;
  }

}
