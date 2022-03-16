import {FicheTechnique} from "./fiche-technique";
import {Etape} from "./etape";
import {Optional} from "@angular/core";
import {Ingredient} from "./ingredient";
import {Denree} from "./denree";

export class EtapeList_Fiche { // class for the db
  constructor(
    public etapes : Etape[], // [0] si etape normale [n] si fiche technique
    @Optional() public identification? : string // remplit uniquement si fiche technique
  ) {}

  /**
   * Récupère la durée total de l'étape de la fiche
   */
  get getDureeTotal(){
    if(this.identification){ // sous-fiche technique
      let temps = 0;
      this.etapes.forEach((etape)=>{
        temps += etape.identification.tempsPreparation;
      })
      return temps;
    }
    else{
      return this.etapes[0].identification.tempsPreparation
    }
  }

}

export class GlobalFicheTechnique {

  constructor(public header : FicheTechnique,
              public progression : EtapeList_Fiche[],
              @Optional() public materielSpecifique? : string,
              @Optional() public materielDressage? : string,
){}


  /**
   * Fonction utiliser pour récupèrer toutes les étapes d'une fiche technique
   */
  getTabEtape() : Etape[]{
    let etapes : Etape[] = []
    this.progression.forEach((etapeFiche)=>{
        etapeFiche.etapes.forEach((etape)=> etapes.push(etape))
    })
    return etapes;
  }

  /**
   * Calcul la durée total des étapes ainsi que le coût matière
   */
  calculDureeEtCoutMatiere(){
    this.header.dureeTotal = 0;
    this.header.coutMatiere = 0;
    this.progression.forEach((etapeFiche)=>{
      etapeFiche.etapes.forEach((etape)=>{ // une seule étape pour les étapes normale, plusieurs si sous-fiche-technique
        this.header.dureeTotal += etape.identification.tempsPreparation; // ajoute son temps de préparation
        etape.contenu.forEach((denree) =>{ // chaque denrée de l'étape (Ingrédient | nombre d'ingrédient)
          this.header.coutMatiere += denree.ingredient.prixUnitaire * denree.number;
        })
      })
    })
  }

  /**
   * Renvoie vrai si la fiche contient tous les ingrédients de la liste
   * @param tabIngredients
   */
  contientIngredients(tabIngredients : string[] ) : boolean{
    let listNomsIngredients : string[] = [];
    tabIngredients.forEach(ing => listNomsIngredients.push(ing)); // copie profonde
    for(let i = 0; i<this.progression.length; i++){
      for(let j = 0 ; j<this.progression[i].etapes.length; j++){
        for(let k = 0 ; k<this.progression[i].etapes[j].contenu.length; k++){
          if(listNomsIngredients.includes(this.progression[i].etapes[j].contenu[k].ingredient.nomIngredient)){
             let id = listNomsIngredients.indexOf(this.progression[i].etapes[j].contenu[k].ingredient.nomIngredient);
             listNomsIngredients.splice(id,1);
             if(listNomsIngredients.length == 0){
               return true // tous les ingrédients sont contenue.
             }
          }
        }
      }
    }
    return false;
  }

  /**
   * Recupère toute la liste des denrées de la fiche technique
   */
  getListDenree() : Denree[]{
    let denrees : Denree[] = []
    this.progression.forEach((etapeFiche)=>{
      etapeFiche.etapes.forEach((etape)=>{ // une seule étape pour les étapes normale, plusieurs si sous-fiche-technique
        etape.contenu.forEach((denree) =>{ // chaque denrée de l'étape (Ingrédient | nombre d'ingrédient)
          if(denrees.find((d)=> d.ingredient.nomIngredient == denree.ingredient.nomIngredient)){
            // on a déjà enregister cette ingrédient, on ajoute son nombre
            denrees.map((d)=> {
              if(d.ingredient.nomIngredient == denree.ingredient.nomIngredient){
                // on a trouvé l'ingrédient, on ajout son nombre
                d.number += denree.number;
              }
            })
          }
          else {
            // on n'avait pas cette ingrédient encore, on l'ajoute
            const nbr = denree.number;
            const ingredient : Ingredient = denree.ingredient.getCopyIngredient();
            denrees.push( new Denree(ingredient, nbr));
          }
        })
      })
    })
    return denrees;
  }

  /**
   * Regarde si un ingrédient est contenu dans la FT
   * S'il le trouve, il le met à jour et recalcul ses coûts..
   * @param ingredient
   * @return boolean true si l'ingrédient est présent, false sinon
   */
  isContientIngredient(ingredient : Ingredient) : boolean{
    let bool = false;
    this.progression.forEach((etapeFiche)=>{
      etapeFiche.etapes.forEach((etape)=>{ // une seule étape pour les étapes normale, plusieurs si sous-fiche-technique
        etape.contenu.forEach((denree) => { // chaque denrée de l'étape (Ingrédient | nombre d'ingrédient)
          if(denree.ingredient.idIngredient == ingredient.idIngredient){
            bool = true;
            denree.ingredient = ingredient; // on le remplace
          }
        })
      })
    })
    this.calculDureeEtCoutMatiere(); // on recalcul les coût de la fiche technique avec ce nouvel ingrédient
    return bool;
  }


}
