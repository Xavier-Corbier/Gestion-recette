import {Optional} from "@angular/core";
/**
 * Class pour gérer une Etiquette
 */
export class Etiquette {
  constructor(public nomPlat : string,
              public listDenree : {nom:string,isAllergene:boolean}[],
              public dateCreation : string,
              public nombreEtiquete : number,
              public idficheReference : string,  // ID de la fiche technique de la vente
              @Optional() public idEtiquette? : string
              ) {
  }
}
