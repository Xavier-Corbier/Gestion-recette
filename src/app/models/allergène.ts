import {Optional} from "@angular/core";

/**
 * Class d'un allergene
 */
export class Allergène {

  constructor(public nom : string, @Optional() public listIngredient? : string[], @Optional() public id? : string) {}

}

