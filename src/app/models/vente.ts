/**
 * Class pour gérer une vente
 */
export class Vente {
  constructor(public nbrPlatVendus : number,
              public dateAchat : string,
              public idficheReference : string)  // ID de la fiche technique de la vente
  {
  }
}
