import {Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from '@angular/core';
import {Ingredient} from "../../../../models/ingredient";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Description} from "../../../../models/description";
import {Etape} from "../../../../models/etape";
import {Denree} from "../../../../models/denree";
import {SearchBarService} from "../../../../services/search-bar.service";

@Component({
  selector: 'app-etape',
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.css']
})
export class EtapeComponent implements OnInit {

  @Input() isPageLecture? : boolean;
  @Input() isPageModif? : boolean;
  @Input() listIngredient? : Ingredient[];
  @Input() etape : Etape; // Etape du composant
  // Emission de l'étape et sa valeur de validité
  @Output() etapeValidateEmit = new EventEmitter<boolean>();

  etapeGroupe! : FormGroup;
  errorMessage : string = '';

  constructor(private fb:FormBuilder,
              public  searchBarService : SearchBarService) {
        this.etape = new Etape(
           new Description("base","desc",10),
      []);
    }

  /**
   * Intialisae le formulaire
   */
  ngOnInit(): void {
    this.initForm();
    this.manageListIngredient();
    this.emitEtape();
  }


  /**
   * getter pour le formArray des ingrédients de l'étape
   */
  get contenu(): FormArray {
    return this.etapeGroupe.get('contenu') as FormArray;
  }

  /**
   * Fonction qui permet d'émettre l'étape et sa validité au composant parent
   */
  emitEtape(){
    this.etape.identification.nom = this.etapeGroupe.get("nomEtape")?.value
    this.etape.identification.description = this.etapeGroupe.get("technique")?.value
    this.etape.identification.tempsPreparation = this.etapeGroupe.get("duree")?.value

    this.etapeValidateEmit.emit(this.etapeGroupe.valid);
  }



  /**
   * Initialise le formulaire
   */
  initForm(){
    this.etapeGroupe = this.fb.group({
      duree : [{value : this.etape.identification.tempsPreparation,disabled : this.isPageLecture},[Validators.required, Validators.min(1)]],
      technique : [this.etape.identification.description,Validators.required],
      nomEtape : [{value : this.etape.identification.nom,disabled : this.isPageLecture},Validators.required],
      contenu : this.fb.array([],[Validators.required, Validators.min(1)]) // au moins 1 ingrédient
    })
  }

  /**
   * Créer une formulaire groupe pour chaque denree contenue dans l'attribut "contenu" de l'étape
   */
  manageListIngredient(){
    this.contenu.clear();

    this.etape.contenu.forEach(denree => {
      this.contenu.push(this.createIngredientFormGroup(denree.ingredient.nomIngredient,denree.ingredient.unite,denree.number))
    });
  }

  /**
   * Ajoute dans l'étape le nombre d'ingrédient lorsqu'il est modifié pour un ingrédient
   * @param event
   * @param i
   * @param newValue
   */
  onNumberChange(event : Event, i : number, newValue : string){
    if (!this.isPageLecture){
      this.etape.contenu[i].number = Number.parseFloat(newValue);
      this.emitEtape();
    }
  }

  /**
   * Créer un formulaire group représentant une denrée d'ingrédient
   * @param nom
   * @param unite
   * @param nb
   */
  createIngredientFormGroup(nom : string, unite : string, nb : number) : FormGroup{
    return this.fb.group({
      nomIngredient : [{value : nom,disabled : this.isPageLecture}, Validators.required],
      unite : [{value : unite,disabled : this.isPageLecture},Validators.required],
      nbrIngredient : [{value : nb,disabled : this.isPageLecture},[Validators.required, Validators.min(0.0000001)]]
    })
  }

  /**
   * Ajout une ingrédient dans l'étape
   * @param nameIngredient
   */
  ajoutIngredient(nameIngredient : string ){
    if(this.listIngredient && this.etape.contenu.filter(denree => denree.ingredient.nomIngredient==nameIngredient).length == 0){
      this.listIngredient.forEach(ingredient => {
        if(ingredient.nomIngredient == nameIngredient){
          this.etape.contenu.push(new Denree(ingredient,1))
          this.contenu.push(this.createIngredientFormGroup(ingredient.nomIngredient,ingredient.unite,0))
          this.emitEtape();
          return;
        }
      })
    }
  }

  /**
   * Ecouteur d'évenement de la recherche d'ingrédient
   * @param valueIngredient
   */
  handleChangesSearchIngredient(valueIngredient : string){
    if(valueIngredient && valueIngredient != "" && valueIngredient.length > 1) {
      this.ajoutIngredient(valueIngredient);
    }
  }

  /**
   * Supprime l'ingrédient de l'étape
   * @param i
   */
  deleteIngredient(i : number){
    this.contenu.removeAt(i);
    this.etape.contenu.splice(i,1);
    this.emitEtape()
  }

}
