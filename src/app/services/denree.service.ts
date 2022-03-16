import { Injectable } from '@angular/core';
import {Denree} from "../models/denree";
import {Ingredient} from "../models/ingredient";

@Injectable({
  providedIn: 'root'
})
export class DenreeService {

  constructor() { }

  /**
   * Converti l'objet denrée de la base de données en objet du modèle Denree
   * @param doc
   */
  doc2Denree(doc : any) : Denree[]{
    let denrees : Denree[] = [];
    doc.forEach((denree : Denree)=>{
      const ingredient = denree.ingredient;
      denrees.push(new Denree(
        new Ingredient(
          ingredient.nomIngredient,
          ingredient.qteIngredient,
          ingredient.prixUnitaire,
          ingredient.unite,
          ingredient.categorie,
          ingredient.listAllergene,
          ingredient.idIngredient),
        denree.number
      ))
    });
    return denrees;
  }
}
