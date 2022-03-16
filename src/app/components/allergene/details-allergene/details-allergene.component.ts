import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Ingredient} from "../../../models/ingredient";
import {Allergène} from "../../../models/allergène";
import {AllergèneService} from "../../../services/allergène.service";
import {IngredientService} from "../../../services/ingredient.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-details-allergene',
  templateUrl: './details-allergene.component.html',
  styleUrls: ['./details-allergene.component.css']
})

/**
 * Component to show an Allergene
 */
export class DetailsAllergeneComponent implements OnInit {
  @Input() allergene? : Allergène;
  @Input() ingredients? : Ingredient[];
  allergeneGroupe! : FormGroup;
  errorMessage : string = '';
  isPageModif : boolean = false;
  isPageLecture : boolean = false;
  id! : string ;
  filterSearch : string = "";

  constructor(private fb:FormBuilder,
              private allergeneService : AllergèneService,
              private ingredientService: IngredientService,
              private toastr: ToastrService,
              private router : Router,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.checkTypeRoute()
    this.initForm();
    this.getAllIngredients();
  }

  /**
   * Get Type of the route (update/read/create)
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
   * Initialize the form
   */
  initForm(){
    this.allergeneGroupe = this.fb.group({
      nom : [{value : '',disabled : this.isPageLecture},Validators.required],
      ingredients: new FormArray([]),
    })
  }

  /**
   * Update the form with the current value of allergene
   */
  updateForm(){
    this.allergeneGroupe.patchValue({
      nom : this.allergene?.nom,
    })
  }

  /**
   * Push new value in the form array
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
   * Action on check change in the form array
   * @param event
   * @param i
   */
  onCheckChange(event: any,i : number) {
    if (!this.isPageLecture){
      const formArray: FormArray = this.allergeneGroupe.get('ingredients') as FormArray;
      formArray.value[i].checked = !formArray.value[i].checked
    }
  }

  /**
   * Manage the form array of the list of the ingredients
   */
  manageListIngredients(){
    let formArray = this.allergeneGroupe.get('ingredients') as FormArray;
    formArray.clear()
    this.ingredients!.forEach(ingredient => {
      if(this.isPageLecture) {
        if (this.allergene?.listIngredient?.includes(ingredient.nomIngredient)) {
          formArray = this.pushForm(formArray, ingredient.nomIngredient, false)
        }
      } else if(this.isPageModif){
        formArray = this.pushForm(formArray, ingredient.nomIngredient, this.allergene?.listIngredient?.includes(ingredient.nomIngredient)!)
      } else {
        formArray = this.pushForm(formArray, ingredient.nomIngredient, false)
      }
    })
  }

  /**
   * Manage the list of the ingredients of the current allergene
   */
  manageAlergene(){
    this.ingredients?.forEach((ingredient) => {
      if (ingredient.listAllergene.includes(this.allergene?.nom!)){
        if(!this.allergene?.listIngredient?.includes(ingredient.nomIngredient)){
          this.allergene?.listIngredient?.push(ingredient.nomIngredient);
        }
      }
    })
  }

  /**
   * Get the current allergene in the database
   */
  getAllergene(){
    this.allergeneService.getAllergene(this.id).subscribe(
      (allergene) => {
        this.allergene = allergene;
        this.manageAlergene()
        this.updateForm();
        this.manageListIngredients();
      }
    );
  }

  /**
   * Get all ingredients int the database
   */
  getAllIngredients(){
    this.ingredientService.getAllIngredients().subscribe(
      (ingredients) => {
        this.ingredients = ingredients;
        if(this.isPageLecture||this.isPageModif){
          this.getAllergene();
        } else {
          this.manageListIngredients();
        }
      }
    );
  }

  /**
   * Action on submit form of the allergene.
   */
  onSubmit(){
    let allergene = this.manageInput()
    if(allergene.nom!=""){
      if(this.isPageModif){
        this.submitUpdate(allergene)
      } else if(!this.isPageLecture){
        this.submitCreate(allergene)
      }
    } else {
      this.toastr.error('Verifiez les valeurs que vous avez entré', 'Erreur d\'enregistrement');
    }
  }

  /**
   * Create an allergene with the input of the form
   * @return Allergène
   */
  manageInput() : Allergène {
    let nom = this.allergeneGroupe.value.nom;
    let ingrédients : string[] =[];
    (this.allergeneGroupe.get('ingredients') as FormArray).value.forEach((value : any) => {
      if(value.checked){
        ingrédients.push(value.name)
      }
    })
    return new Allergène(nom,ingrédients)
  }

  /**
   * Submit the allergene in the database if it is an update
   * @param allergene
   */
  submitUpdate(allergene : Allergène){
    allergene.id = this.id
    this.allergeneService.updateAllergene(allergene).then((result) => {
      this.toastr.success(result, 'Enregistrement effectué');
      this.router.navigate(['/Allergènes'])
    })
    .catch((error) => {
      this.toastr.error(error, 'Erreur d\'enregistrement');
    })
  }

  /**
   * Submit the input in the database if it is a create
   * @param allergene
   */
  submitCreate(allergene : Allergène){
    this.allergeneService.addNewAllergene(allergene).then((result) => {
      this.toastr.success(result, 'Enregistrement effectué');
      this.router.navigate(['/Allergènes'])
    })
    .catch((error) => {
      this.toastr.error(error, 'Erreur d\'enregistrement');
    })
  }

  /**
   * Filter the ingredient in the form array
   */
  filterIngredient(){
    return (this.allergeneGroupe.get('ingredients') as FormArray).value.filter((ingredient : {cheked : boolean, name : string })  => ingredient.name.includes(this.filterSearch));
  }

  /**
   * Action on search ingredient to update the current value of search
   * @param value
   */
  onSearchIngredient(value : string){
    this.filterSearch = value;
  }
}
