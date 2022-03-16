/**
 * Class pour gérer les différents coûts
 */
export class StoreApp {
  public coûtMoyen : number
  public coûtForfaitaire : number
  public coefPrixDeVente : number
  public coefCoûtProduction : number

  constructor( coûtMoyen : number,
               coûtForfaitaire : number,
               coefPrixDeVente : number,
               coefCoûtProduction : number
  ){
    this.coûtMoyen=coûtMoyen;
    this.coûtForfaitaire=coûtForfaitaire;
    this.coefPrixDeVente=coefPrixDeVente;
    this.coefCoûtProduction=coefCoûtProduction;
  }
}
