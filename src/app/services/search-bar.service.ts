import { Injectable } from '@angular/core';
import {Ingredient} from "../models/ingredient";

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour convertir les tableaux de la barre de recherche
 */
export class SearchBarService {

  constructor() { }

  /**
   * Convertion avec id = idIngredient et name = nomIngredient
   * @param array
   */
  convertIngredient(array : Ingredient[]) : any{
    let result: { _id: string | undefined; name: string; }[] = [];
    array.forEach( value => {
      result.push({
        _id : value.idIngredient,
        name : value.nomIngredient
      })
    })
    return result;
  }

  /**
   * Convertion avec id = idFicheTechnique et name = nomPlat
   * @param array
   */
  convertNameFicheTechnique(array : {nom : string, id : string}[]) : any{
    let result: { _id: string | undefined; name: string; }[] = [];
    array.forEach( value => {
      result.push({
        _id : value.id,
        name : value.nom
      })
    })
    return result;
}

  /**
   * Convertion ingredient avec id = nomIngredient et name = nomIngredient
   * @param array
   */
  convertIngredientFicheTechnique(array : Ingredient[]) : any{
    let result: { _id: string | undefined; name: string; }[] = [];
    array.forEach( value => {
      result.push({
        _id : value.nomIngredient,
        name : value.nomIngredient
      })
    })
    return result;
  }
}
