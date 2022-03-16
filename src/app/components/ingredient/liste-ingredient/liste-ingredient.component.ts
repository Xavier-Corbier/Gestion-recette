import {Component, Input, OnInit} from '@angular/core';
import {IngredientService} from "../../../services/ingredient.service";
import {Ingredient} from "../../../models/ingredient";
import {ToastrService} from "ngx-toastr";
import swal from "sweetalert2";
import {CategorieIngredientService} from "../../../services/categorie-ingredient.service";
import {CategorieIngredient} from "../../../models/categorie-ingredient";
import {SearchBarService} from "../../../services/search-bar.service";

@Component({
  selector: 'app-liste-ingredient',
  templateUrl: './liste-ingredient.component.html',
  styleUrls: ['./liste-ingredient.component.css']
})

/**
 * Component pour afficher la liste des ingrédients
 */
export class ListeIngredientComponent implements OnInit {

  @Input() tabIngredient? : Ingredient[]
  @Input() tabCategorieIngredient? : CategorieIngredient[]
  private errorMsg : string = "";
  private filterSearch : string = "";
  private categorieSelect : string = "";
  private idPage : number = 0;
  public numberByPage : number = 10;

  // Sort
  private tabSort = ["Nom","Quantité","PrixUnitaire","ValeurStock"];
  public idSort : number = 0;
  public typeSort :number =  1; // 1 : ASC -1 : DESC

  constructor(private ingredientService : IngredientService,
              private categorieIngredientService : CategorieIngredientService,
              public searchBarService : SearchBarService,
              private toastr: ToastrService
              ) { }

  ngOnInit(): void {
    this.getAllIngredients()
    this.getAllCategorieIngredients()
  }

  /**
   * Récupère les ingrédients dans la base de données
   */
  getAllIngredients(){
    this.ingredientService.getAllIngredients().subscribe(
      (tabIngredient)=> {
        if(tabIngredient){
          this.tabIngredient = tabIngredient
        }
        else{
          this.errorMsg = "Il n'y a pas d'ingredient";
        }
      });
  }

  /**
   * Récupère les catégories dans la base de données
   */
  getAllCategorieIngredients(){
    this.categorieIngredientService.getAllCategorieIngredients().subscribe(
      (tabCategorieIngredient)=> {
        if(tabCategorieIngredient){
          this.tabCategorieIngredient = tabCategorieIngredient
        }
        else{
          this.errorMsg = "Il n'y a pas de catégorie d'ingredient";
        }
      });
  }

  /**
   * Action pour chercher un ingrédient
   * @param value
   */
  onSearchIngredient(value : string){
    this.filterSearch = value;
  }

  /**
   * Renvoie la taille du tableau filtrer
   */
  tailleTabFilter(){
    if(this.tabIngredient) {
      const tab = this.tabFilter(this.tabIngredient);
      return tab.length;
    }
    return 0;
  }

  /**
   * Emission de l'id de la pagination à afficher
   * @param id
   */
  idPageEmit(id : number){
    this.idPage = id;
  }

  /**
   * Action on change catégorie
   * @param value
   */
  onChangeCategorie(value : string){
    this.categorieSelect = value;
  }

  /**
   * Return le tableau des ingrédients filtrer avec la catégorie et le filtre de recherche
   * @param tabIngredient
   */
  tabFilter(tabIngredient : Ingredient[]){
    return tabIngredient.filter(
        ingredient => ingredient.nomIngredient.toLowerCase().includes(this.filterSearch.toLowerCase())
        && (this.categorieSelect != ""? ingredient.categorie == this.categorieSelect : true))
  }

  /**
   * Modifie la méthode de sort du tableau filtrer
   * @param id
   */
  setTypeSortTableau(id : number){
    if(id>=0 && id<this.tabSort.length){
      if(this.idSort === id){
        this.typeSort = -this.typeSort; // on change de type de sort (ASC - DESC)
      }
      else{
        this.idSort = id;
        this.typeSort = 1;
      }
    }
  }

  /**
   * Ordonne le tableau en fonction de la méthode de sort choisie.
   * @param ing1
   * @param ing2
   */
  sortTabIngedient(ing1 : Ingredient, ing2 : Ingredient){
    if(this.tabSort){
      switch (this.tabSort[this.idSort]){
        case "ValeurStock":
          if (ing1.qteIngredient * ing1.prixUnitaire > ing2.qteIngredient * ing2.prixUnitaire){ return this.typeSort}
          else if(ing1.qteIngredient * ing1.prixUnitaire < ing2.qteIngredient * ing2.prixUnitaire){return -this.typeSort}
          return 0;
        case "Quantité":
          if (ing1.qteIngredient  > ing2.qteIngredient){ return this.typeSort}
          else if(ing1.qteIngredient < ing2.qteIngredient ){return -this.typeSort}
          return 0;
        case "PrixUnitaire":
          if (ing1.prixUnitaire  > ing2.prixUnitaire){ return this.typeSort}
          else if(ing1.prixUnitaire < ing2.prixUnitaire ){return -this.typeSort}
          return 0;
        default: // case : "nom"
          if (ing1.nomIngredient > ing2.nomIngredient){ return this.typeSort}
          else if(ing1.nomIngredient < ing2.nomIngredient){return -this.typeSort}
          return 0;
      }
    }
    return 0;
  }

  /**
   * Filter tab ingredient
   * @param tabIngredient
   */
  filter(tabIngredient : Ingredient[] | undefined ) : Ingredient[]  | undefined{
    if(tabIngredient){
      return this.tabFilter(tabIngredient)
                 .sort((ing1,ing2)=>this.sortTabIngedient(ing1,ing2)) // on l'ordonne
                 .filter((ingredient,i) => i >= this.idPage*this.numberByPage && i < (this.idPage +1)*this.numberByPage);
    }
    return tabIngredient;
  }

  /**
   * Action lors du click sur le bouton supprimer
   * @param uid
   */
  onClickDelete(uid:string){
    swal.fire({
      title: 'Voulez-vous le supprimer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4caf50',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ingredientService.deleteIngredient(uid).then(
          (result)=> {
            this.toastr.success(result,'Enregistrement effectué')
          }).catch((error)=>{
          this.toastr.error(error,'Erreur d\'enregistrement')
        })
      }
    })
  }
}
