import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {ToastrService} from "ngx-toastr";
import {GlobalFicheTechnique} from "../../../models/global-fiche-technique";
import {FicheTechniqueService} from "../../../services/fiche-technique.service";
import {CategorieRecette} from "../../../models/categorie-recette";
import {CategorieRecetteService} from "../../../services/categorie-recette.service";
import swal from "sweetalert2";
import {SearchBarService} from "../../../services/search-bar.service";
import {Ingredient} from "../../../models/ingredient";
import {IngredientService} from "../../../services/ingredient.service";

@Component({
  selector: 'app-liste-fiche-technique',
  templateUrl: './liste-fiche-technique.component.html',
  styleUrls: ['./liste-fiche-technique.component.css']
})
export class ListeFicheTechniqueComponent implements OnInit {
  estConnecte : boolean = false;
  estAdmin : boolean = false;
  subscriptionUser : Subscription | undefined ; // suit l'utilisateur connecté
  ficheTechniques? : GlobalFicheTechnique[];
  listIngredient? : Ingredient[];

  /** Attribut pour la recherche et la sélection **/
  tabCategorieRecette? : CategorieRecette[];
  private errorMsg : string = "";
  private filterSearch : string = "";
  private tabNameIngredientSearch : string[] = [];
  private categorieSelect : string = "";
  private idPage : number = 0;
  public numberByPage : number = 10;

  constructor(private utilisateurService : UtilisateurService,
              private ficheService : FicheTechniqueService,
              private categorieRecetteService : CategorieRecetteService,
              private toastr: ToastrService,
              public  searchBarService : SearchBarService,
              private ingredientService : IngredientService
  ) {
  }

  ngOnInit(): void {
    this.subscribreEtatUtilisateur();
    this.getAllFicheTechnique();
    this.getAllCategorieRecette();
    this.getAllIngredients();
  }

  ngOnDestroy() : void{
    if(this.subscriptionUser){
      this.subscriptionUser.unsubscribe();
    }
  }


  /**
   * Dés que l'état de l'utilisateur change, la fonction se lance, permettant d'adapté les droits de la page
   */
  subscribreEtatUtilisateur(){
    // la fonction va se lancer à chaque fois que UtilisateurService émite le currentUser
    this.subscriptionUser = this.utilisateurService.getCurrentUser().subscribe(
      (utilisateur) => {
        if(utilisateur){ // il y a un utilisateur connecté
          this.estConnecte = true;
          this.estAdmin = utilisateur.getDroitAdmin();
        }
        else{
          this.estConnecte = false;
          this.estAdmin = false;
        }
      }
    );
    this.utilisateurService.emitCurrentUser(); // on demande de recevoir l'utilisateur
  }

  getAllFicheTechnique(){
    const sub = this.ficheService.getAllFichesTechnique(true).subscribe(
      (list)=>{
        if(list){
          this.ficheTechniques = list;
        }
        sub.unsubscribe();
      }
    )
  }

  /**
   * Récupère tous les ingrédients de la base de données
   */
  getAllIngredients(){
    let sub = this.ingredientService.getAllIngredients().subscribe(
      (ingredients) => {
        sub.unsubscribe();
        this.listIngredient = ingredients;
      }
    );
  }

  getAllCategorieRecette(){
    let subscribe = this.categorieRecetteService.getAllCategorieRecettes().subscribe(
      (tabCategorie) => {
        if(tabCategorie){
          this.tabCategorieRecette = tabCategorie;
        }
        else{
          this.errorMsg = "Il n'y a pas de catégorie de recette";
        }
        subscribe.unsubscribe();
      });
  }

  /**
   * Action on search fiche technique
   * @param value
   */
  onSearchFiche(value : string){
    this.filterSearch = value;
  }

  /**
   * Renvoie la taille du tableau filtrer
   */
  tailleTabFilter(){
    if(this.ficheTechniques){
      const tab = this.ficheTechniques.filter(fiche => fiche.header.nomPlat.toLowerCase().includes(this.filterSearch.toLowerCase()) && (this.categorieSelect != ""? fiche.header.categorie == this.categorieSelect : true ) && (this.tabNameIngredientSearch.length == 0? true : fiche.contientIngredients(this.tabNameIngredientSearch)));
      return tab.length;
    }
    return 0;
  }

  /**
   * Action on change catégorie
   * @param value
   */
  onChangeCategorie(value : string){
    this.categorieSelect = value;
  }

  /**
   * Ecouteur d'évenement de la recherche d'ingrédient
   * @param valueIngredient
   */
  handleChangesSearchIngredient(valueIngredient: string[]){
    this.tabNameIngredientSearch = valueIngredient;
  }

  /**
   * Filter tab ingredient
   * @param tabFiches
   */
  filter(tabFiches : GlobalFicheTechnique[] | undefined ) : GlobalFicheTechnique[]  | undefined{
    if(tabFiches){
      return tabFiches.filter(fiche => fiche.header.nomPlat.toLowerCase().includes(this.filterSearch.toLowerCase()) && (this.categorieSelect != ""? fiche.header.categorie == this.categorieSelect : true ) && (this.tabNameIngredientSearch.length == 0? true : fiche.contientIngredients(this.tabNameIngredientSearch)))
        .filter((fiche,i) => i >= this.idPage*this.numberByPage && i < (this.idPage +1)*this.numberByPage);
    }
    return tabFiches;
  }

  /**
   * Emission de l'id de la pagination à afficher
   * @param id
   */
  idPageEmit(id : number){
    this.idPage = id;
  }

  /**
   * Action après un click sur le bouton supprimer d'une fiche technique
   * @param uid
   */
  onClickDelete(uid:string){
    swal.fire({
      title: 'Voulez-vous la supprimer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4caf50',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ficheService.deleteFicheTech(uid).then(
          (result)=> {
            this.toastr.success(result,'Enregistrement effectué')
            let id : number = -1;
            this.ficheTechniques?.forEach((value, index)=>{
              if(value.header.idFicheTechnique == uid){
                id = index;
              }
            })
            if(id != -1){
              this.ficheTechniques?.splice(id,1); // on le supprime du tableau
            }
          }).catch((error)=>{
          this.toastr.error(error,'Erreur d\'enregistrement')
        })
      }
    })
  }






}
