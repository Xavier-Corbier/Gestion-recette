import {Optional} from "@angular/core";

/**
 * Class pour gérér un ingrédient
 */
export class Ingredient {

  constructor(
              public nomIngredient: string,
              public qteIngredient: number,
              public prixUnitaire: number,
              public unite: string,
              public categorie: string,
              public listAllergene: string[],
              @Optional() public idIngredient?: string
  ) {
  }

  setId(id : string){
    this.idIngredient = id;
  }

  public getCopyIngredient() : Ingredient{
    return new Ingredient(
      this.nomIngredient,
      this.qteIngredient,
      this.prixUnitaire,
      this.unite,
      this.categorie,
      this.listAllergene,
      this.idIngredient
    )
  }

  /**
   * Calcul le coût total d'un ingrédient
   */
  public getCostStock() : number{
    return this.qteIngredient * this.prixUnitaire
  }
}


