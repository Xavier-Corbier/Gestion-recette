import {StoreApp} from "./store-app";

export class FicheTechnique {

  constructor(
               public nomPlat : string,
               public nomAuteur : string,
               public nbrCouvert : number,
               public isCalculCharge : boolean = true,
               public coutMatiere : number = 0, /** Coût total des ingrédients **/
               public dureeTotal : number = 0, /** Durée total en minute à la réalisation de la fiche technique **/
               public coutMoyenHorraire : number = 0, /**  Cout de travail d'1heure pour le personnel **/
               public coutForfaitaire : number = 0,  /**  Cout des fluides **/
               public coefCoutProduction : number = 0, /** Coef pour calculer le prix de vente à partir du cout de prod **/
               public coefPrixDeVente : number = 0, /** coef utilisé lorsqu'on a pas utilisé les charges pour les calculs **/
               public idFicheTechnique? : string,
               public categorie : string = "plat" /** Provisoire **/
    ) {
  }

  get coutProduction(){
    if(this.isCalculCharge) {
      return this.coutMatiereTotal + this.coutPersonnel + this.coutFluide;
    }
    else{
      return this.coutMatiereTotal;
    }
  }

  get coutFluide(){
    return this.coutForfaitaire;
  }

  get coutMatiereTotal(){
    return this.coutMatiere * 1.05 /** +5% ASS **/
  }

  get coutProductionPortion(){
    if(this.nbrCouvert == 0){
      return 0;
    }
    return this.coutProduction / this.nbrCouvert;
  }

  get dureeTotalHeure(){
    return (this.dureeTotal / 60)
  }

  get coutPersonnel(){
    return this.dureeTotalHeure * this.coutMoyenHorraire;
  }

  get prixDeVenteTotalTTC(){
    if(this.isCalculCharge){
      return this.coutProduction * this.coefCoutProduction;
    }
    else{
      return  this.coutProduction * this.coefPrixDeVente;
    }
  }

  get prixDeVenteTotalHT(){
    return this.prixDeVenteTotalTTC / 1.1 /** TVA 10% **/
  }

  get prixDeVentePortionTTC(){
    if(this.nbrCouvert == 0){
      return 0 ;
    }
    return this.prixDeVenteTotalTTC / this.nbrCouvert;
  }

  get prixDeVentePortionHT(){
    if(this.nbrCouvert == 0){
      return 0 ;
    }
    return this.prixDeVenteTotalHT / this.nbrCouvert;
  }

  /**
   * return vrai si on vent plus chère que le coût de la production
   */
  get isBenefice(){
    return this.beneficeTotal > 0;
  }

  get beneficeTotal(){
    return this.prixDeVenteTotalHT - this.coutProduction
  }

  get beneficeParPortion(){
    return this.prixDeVentePortionHT - this.coutProductionPortion;
  }

  /**
   * Retourne le nombre au minimum de portion à vendre pour être rentable
   */
  get seuilRentabilite(){
    let i = 0;
    if(this.coutProduction !== undefined && this.prixDeVentePortionHT!==undefined && this.prixDeVentePortionHT>0){
      let benef = -this.coutProduction;
      while(benef < 0 ){
        benef += this.prixDeVentePortionHT;
        i++;
      }
      return i;
    }
    else{
      return 0;
    }

  }

  setStore(store : StoreApp){
    this.coutMoyenHorraire = store.coûtMoyen; // cout du personnel par heure
    this.coefCoutProduction = store.coefCoûtProduction; // coef qui permet de savoir le prix de vente
    this.coutForfaitaire = store.coûtForfaitaire; // fluide par heure
    this.coefPrixDeVente = store.coefPrixDeVente; // coef utilisé lorsqu'on a pas utilisé les charges pour les calculs
  }
}
