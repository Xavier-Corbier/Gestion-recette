import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ingredient} from "../../../models/ingredient";
import {IngredientService} from "../../../services/ingredient.service";
import { ToastrService } from 'ngx-toastr';
import {AllergèneService} from "../../../services/allergène.service";
import {Allergène} from "../../../models/allergène";
import {ActivatedRoute, Router} from "@angular/router";
import {CategorieIngredientService} from "../../../services/categorie-ingredient.service";
import {CategorieIngredient} from "../../../models/categorie-ingredient";

@Component({
  selector: 'app-details-ingredient',
  templateUrl: './details-ingredient.component.html',
  styleUrls: ['./details-ingredient.component.css']
})

/**
 * Component pour afficher les détails d'un ingrédient
 */
export class DetailsIngredientComponent implements OnInit {
  @Input() allergenes? : Allergène[];
  @Input() tabCategorieIngredient? : CategorieIngredient[];
  @Input() ingredient? : Ingredient;
  ingredientGroupe! : FormGroup;
  errorMessage : string = '';
  isPageModif : boolean = false;
  isPageLecture : boolean = false;
  private filterSearch : string = "";
  id! : string ;
  select : boolean = true;

  constructor(private fb:FormBuilder,
              private toastr: ToastrService,
              private ingredientService: IngredientService,
              private allergeneService: AllergèneService,
              private categorieIngredientService : CategorieIngredientService,
              private route : ActivatedRoute,
              private router : Router
              ) { }

  /**
   * Initialisation du composant
   * Regarde sur quel route il est (lecture, modification ou création)
   */
  ngOnInit(): void {
    this.checkTypeRoute()
    this.initForm();
    if(this.isPageLecture||this.isPageModif){
      this.getIngredient();
    }
    this.getAllAllergenes();
    this.getAllCategorieIngredient();
  }

  /**
   * Récupère le type de route (Lecture/Modif/Read)
   */
  checkTypeRoute(){
    this.isPageModif = this.route.snapshot.paramMap.has('modifId');
    this.isPageLecture = this.route.snapshot.paramMap.has('lectureId');
    if(this.isPageModif){ // page modif
      this.id = this.route.snapshot.paramMap.get('modifId')!;
    }
    else if(this.isPageLecture) { // page lecture
      this.id = this.route.snapshot.paramMap.get('lectureId')!;
    }
  }

  /**
   * Initialise le formulaire
   */
  initForm(){
    this.ingredientGroupe = this.fb.group({
      nom : [{value:'',disabled : this.isPageLecture},Validators.required],
      quantite : [{value:'',disabled : this.isPageLecture},Validators.required],
      unite : [{value:'',disabled : this.isPageLecture},Validators.required],
      prixUnitaire : [{value:'',disabled : this.isPageLecture},Validators.required],
      categorie : [{value:'',disabled : this.isPageLecture},Validators.required],
      categorie_text : [{value:'',disabled : this.isPageLecture},],
      allergenes: new FormArray([]),
    })
  }

  /**
   * Mise à jour du formulaire avec la valeur courante de l'ingrédient
   */
  updateForm(){
    this.ingredientGroupe.patchValue({
      nom : this.ingredient?.nomIngredient,
      quantite : this.ingredient?.qteIngredient,
      unite : this.ingredient?.unite,
      prixUnitaire : this.ingredient?.prixUnitaire,
      categorie : this.ingredient?.categorie,
      categorie_text : this.ingredient?.categorie,
    })
  }

  /**
   * Ajout d'une nouvelle valeur dans le tableau de formulaire
   * @param formArray
   * @param name
   * @param checked
   */
  pushForm(formArray: FormArray, name : string, checked: boolean) : FormArray {
    formArray.push(new FormGroup({
      name: new FormControl(name),
      checked: new FormControl(checked),
    }))
    return formArray
  }

  /**
   * Action lors du changement des checkboxes
   * @param event
   * @param i
   */
  onCheckChange(event: any,i : number) {
    if (!this.isPageLecture){
      const formArray: FormArray = this.ingredientGroupe.get('allergenes') as FormArray;
      formArray.value[i].checked = !formArray.value[i].checked
    }
  }

  /**
   * Gestion de la liste des allergenes
   */
  manageListAllergenes(){
    let formArray = this.ingredientGroupe.get('allergenes') as FormArray;
    formArray.clear()
    this.allergenes!.forEach(allergene => {
      if(this.isPageLecture) {
        if (this.ingredient?.listAllergene.includes(allergene.nom)) {
          formArray = this.pushForm(formArray, allergene.nom, false)
        }
      } else if(this.isPageModif){
        formArray = this.pushForm(formArray, allergene.nom, this.ingredient?.listAllergene.includes(allergene.nom)!)
      } else {
        formArray = this.pushForm(formArray, allergene.nom, false)
      }
    })
  }

  /**
   * Récupère l' ingrédient de la base de données
   */
  getIngredient(){
    this.ingredientService.getIngredient(this.id).subscribe(
      (ingredient) => {
        this.ingredient = ingredient;
        this.updateForm();
      }
    );
  }

  /**
   * Récupère les ingrédients de la base de données
   */
  getAllAllergenes(){
    this.allergeneService.getAllAllergenes().subscribe(
      (allergenes) => {
        this.allergenes = allergenes;
        this.manageListAllergenes();
      }
    );
  }

  /**
   * Récupère les catégories d'ingrédients
   */
  getAllCategorieIngredient(){
    this.categorieIngredientService.getAllCategorieIngredients().subscribe(
      (tabCategorieIngredient)=> {
        this.tabCategorieIngredient = tabCategorieIngredient
      });
  }

  /**
   * Action pour envoyer le formulaire
   */
  onSubmit(){
    let ingredient = this.manageInput()
    if(ingredient.nomIngredient!=""&&ingredient.qteIngredient>=0&&ingredient.unite!=""&&ingredient.prixUnitaire>=0&&ingredient.categorie!=""){
      if(this.isPageModif){
        this.submitUpdate(ingredient)
      } else if(!this.isPageLecture){
        this.submitCreate(ingredient)
      }
    } else {
      this.toastr.error('Verifiez les valeurs que vous avez entré', 'Erreur d\'enregistrement');
    }
  }

  /**
   * Gestion des input du formulaire
   */
  manageInput() : Ingredient {
    let nom = this.ingredientGroupe.value.nom;
    let quantite = this.ingredientGroupe.value.quantite;
    let unite = this.ingredientGroupe.value.unite;
    let prixUnitaire = this.ingredientGroupe.value.prixUnitaire;
    let categorie = "";
    if (this.select){
      categorie = this.ingredientGroupe.value.categorie;
    } else {
      categorie = this.ingredientGroupe.value.categorie_text;
    }
    let allergènes : string[] =[];
    (this.ingredientGroupe.get('allergenes') as FormArray).value.forEach((value : any) => {
      if(value.checked){
        allergènes.push(value.name)
      }
    })
    return new Ingredient(nom,quantite,prixUnitaire,unite,categorie,allergènes)
  }

  /**
   * Envoie une mise à jour d'ingrédient
   * @param ingredient
   */
  submitUpdate(ingredient : Ingredient){
    ingredient.idIngredient = this.id
    this.ingredientService.updateIngredient(ingredient, !this.select).then((result) => {
      this.toastr.success(result, 'Enregistrement effectué');
      this.router.navigate(['/Ingrédients'])
    })
    .catch((error) => {
      this.toastr.error(error, 'Erreur d\'enregistrement');
    })
  }

  /**
   * Envoie une création d'ingrédient
   * @param ingredient
   */
  submitCreate(ingredient : Ingredient){
    this.ingredientService.addNewIngredient(ingredient,!this.select).then((result) => {
      this.toastr.success(result, 'Enregistrement effectué');
      this.router.navigate(['/Ingrédients'])
    })
    .catch((error) => {
      this.toastr.error(error, 'Erreur d\'enregistrement');
    })
  }

  /**
   * Filter allergene
   */
  filterAllergene(){
    return (this.ingredientGroupe.get('allergenes') as FormArray).value.filter((allergene : {cheked : boolean, name : string })  => allergene.name.includes(this.filterSearch));
  }

  /**
   * Action on search allergene
   * @param value
   */
  onSearchAllergene(value : string){
    this.filterSearch = value;
  }

  /**
   * Action pour changer le type input
   */
  onChangeTypeInput(){
    this.select=!this.select
    if(this.select){
      this.ingredientGroupe.controls["categorie"].setValidators([Validators.required]);
      this.ingredientGroupe.controls["categorie_text"].clearValidators();
    } else {
      this.ingredientGroupe.controls["categorie_text"].setValidators([Validators.required]);
      this.ingredientGroupe.controls["categorie"].clearValidators();
    }
    this.ingredientGroupe.controls["categorie_text"].updateValueAndValidity()
    this.ingredientGroupe.controls["categorie"].updateValueAndValidity()
  }

  /**
    Fonction pour créer rapidement
   */

  getRandomIntInclusive(min : number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

  createMultiIngredient(){
    const tabIngredient = ["jambom", "bouteille", "chocolat","ail", "fromage","éclair","vanille","oignon", "courgette","carotte","frite", "beure","sel", "sucre","salade","aubergine","steak","poisson"]
    const quantite = []
    const unite = []
    const categories = []
    const prixUnitaire = []
    const tabAllergene = []
    const uniteChoix = ["kg", "piece","pm","pa","metre"]
    const tabIngredientFinal = []
    for(let i = 0; i< tabIngredient.length; i++){
      quantite.push(this.getRandomIntInclusive(2,15))
      unite.push(uniteChoix[this.getRandomIntInclusive(0,uniteChoix.length-1)])
      prixUnitaire.push(this.getRandomIntInclusive(1,5))
      categories.push(this.getRandomIntInclusive(1,2) == 1? "cat1" : "cat2")
      tabAllergene.push(this.getRandomIntInclusive(1,2)==1? ["gfgfgfgfd"] : ["fdfd"]);
      let ingredient = new Ingredient(tabIngredient[i],quantite[i],prixUnitaire[i],unite[i],categories[i],tabAllergene[i]);
      this.submitCreate(ingredient)
    }
  }
}
