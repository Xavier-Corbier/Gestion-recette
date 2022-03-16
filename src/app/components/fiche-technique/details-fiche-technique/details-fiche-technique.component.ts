import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Ingredient} from "../../../models/ingredient";
import {IngredientService} from "../../../services/ingredient.service";
import {Etape} from "../../../models/etape";
import {Description} from "../../../models/description";
import {MdbTabsComponent} from "mdb-angular-ui-kit/tabs";
import {FicheTechnique} from "../../../models/fiche-technique";
import {StoreAppService} from "../../../services/store-app.service";
import {Denree} from "../../../models/denree";
import {EtapeList_Fiche, GlobalFicheTechnique} from "../../../models/global-fiche-technique";
import {FicheTechniqueService} from "../../../services/fiche-technique.service";
import {MdbTabChange} from "mdb-angular-ui-kit/tabs/tabs.component";
import {ToastrService} from "ngx-toastr";
import {CategorieRecette} from "../../../models/categorie-recette";
import {CategorieRecetteService} from "../../../services/categorie-recette.service";
import {SearchBarService} from "../../../services/search-bar.service";
import {Subscription} from "rxjs";
import {UtilisateurService} from "../../../services/utilisateur.service";
import swal from "sweetalert2";


@Component({
  selector: 'app-details-fiche-technique',
  templateUrl: './details-fiche-technique.component.html',
  styleUrls: ['./details-fiche-technique.component.css']
})


//TODO table formArray : https://www.concretepage.com/angular/angular-formarray-validation
export class DetailsFicheTechniqueComponent implements OnInit {
  @ViewChild('tabs') tabs!: MdbTabsComponent; // permet de récupérer l'élément HTML pour changer les tabs

  ficheTechniqueGroupe! : FormGroup; // formulaire de l'header de la fiche technique
  tabIngredient? : Ingredient[];
  tabCategorieRecette? : CategorieRecette[];
  tabValiditeForm : boolean[]; // contient les valeurs de validité des étapes pour leurs formulaires
  globalFT : GlobalFicheTechnique; // Fiche technique final qui sera enregistrer
  listDenreeRecette? : Denree[] = [];
  listNameFichesTechniques? : {nom : string, id : string}[] = []; // liste des noms des fiche techniques

  isPageModif : boolean = false;
  isPageLecture : boolean = false;
  id : string = "";
  select : boolean = true;
  estConnecte : boolean = false;
  estAdmin : boolean = false;
  subscriptionUser : Subscription | undefined ; // suit l'utilisateur connecté

  constructor(private fb:FormBuilder,
              private route : ActivatedRoute,
              public router : Router,
              private ingredientService : IngredientService,
              private ficheTechniqueService : FicheTechniqueService,
              private storeService : StoreAppService,
              private categoreRecetteService : CategorieRecetteService,
              private toastr : ToastrService,
              private utilisateurService : UtilisateurService,
              public searchBarService : SearchBarService) {
    this.tabValiditeForm = [];

    this.globalFT = new GlobalFicheTechnique(
      new FicheTechnique("","",1),
      []
    )
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

  /**
   * Vérifie sur quel type de page on est (lecture, modification, création)
   * Récupère tous les ingrédients de la base de données
   * Initilise le formulaire de l'header de la fiche technique
   */
  ngOnInit(): void {
    this.checkTypeRoute();
    this.getAllIngredients();
    this.getAllCategorieRecette();
    this.getAllNameFichesTechnique();
    this.initForm();
    if(this.isPageLecture||this.isPageModif){
      this.getFicheTechnique();
    }
    else{
      this.getStore();
    }
    this.subscribreEtatUtilisateur()
  }

  /**
   * Récupère les valeurs par défaut des coûts et coefficient
   */
  getStore(){
    // récupère les valeurs par défaut de calculs
    const sub = this.storeService.getStore().subscribe((value)=>{
      this.globalFT.header.setStore(value);
      this.ficheTechniqueGroupe.get("coutMoyenHorraire")?.setValue(value.coûtMoyen);
      this.ficheTechniqueGroupe.get("coutFluide")?.setValue(value.coûtForfaitaire);
      this.ficheTechniqueGroupe.get("coefCoutDeProduction")?.setValue(value.coefCoûtProduction);
      this.ficheTechniqueGroupe.get("coefPrixDeVente")?.setValue(value.coefPrixDeVente);
      sub.unsubscribe();
    })
  }


  /**
   * Initialise le formulaire de l'header de la fiche technique
   */
  initForm(){
    this.ficheTechniqueGroupe = this.fb.group({
      nom : [{value : '', disabled : this.isPageLecture},Validators.required],
      auteur : [{value : '', disabled : this.isPageLecture},Validators.required],
      nombreDeCouvert : [{value : 1, disabled : this.isPageLecture},[Validators.required,Validators.min(1)]],
      coutFluide : [{value : 1, disabled : this.isPageLecture}],
      coutMoyenHorraire : [{value : 1, disabled : this.isPageLecture}],
      coefCoutDeProduction : [{value : 1, disabled : this.isPageLecture}],
      coefPrixDeVente : [{value : 1, disabled : this.isPageLecture}],
      categorie : [{value:'',disabled : this.isPageLecture},Validators.required],
      categorie_text : [{value:'',disabled : this.isPageLecture}],
      materielSpecifique : [''],
      materielDressage : ['']
    })
    // Suit les différents changements des nombres utilisés pour le calcul des coûts
    this.ficheTechniqueGroupe.get("nombreDeCouvert")!.valueChanges.subscribe(selectedValue => {
      if(selectedValue > 0){this.globalFT.header.nbrCouvert = selectedValue}
    })
    this.ficheTechniqueGroupe.get("coutFluide")!.valueChanges.subscribe(selectedValue => {
      if(selectedValue > 0){this.globalFT.header.coutForfaitaire = selectedValue}
    })
    this.ficheTechniqueGroupe.get("coutMoyenHorraire")!.valueChanges.subscribe(selectedValue => {
      if(selectedValue > 0){this.globalFT.header.coutMoyenHorraire = selectedValue}
    })
    this.ficheTechniqueGroupe.get("coefCoutDeProduction")!.valueChanges.subscribe(selectedValue => {
      if(selectedValue > 0){this.globalFT.header.coefCoutProduction = selectedValue}
    })
    this.ficheTechniqueGroupe.get("coefPrixDeVente")!.valueChanges.subscribe(selectedValue => {
      if(selectedValue > 0){this.globalFT.header.coefPrixDeVente = selectedValue}
    })

  }

  /**
   * Modifie le formulaire en mettant à jour les valeurs de la fiche technique
   */
  updateForm(){
    this.ficheTechniqueGroupe.patchValue({
      nom : this.globalFT.header.nomPlat,
      auteur : this.globalFT.header.nomAuteur,
      nombreDeCouvert : this.globalFT.header.nbrCouvert,
      coutFluide : this.globalFT.header.coutForfaitaire,
      coutMoyenHorraire : this.globalFT.header.coutMoyenHorraire,
      coefCoutDeProduction : this.globalFT.header.coefCoutProduction,
      coefPrixDeVente : this.globalFT.header.coefPrixDeVente,
      categorie : this.globalFT.header.categorie,
      categorie_text : this.globalFT.header.categorie,
      materielSpecifique : this.globalFT.materielSpecifique? this.globalFT.materielSpecifique : "",
      materielDressage : this.globalFT.materielDressage? this.globalFT.materielDressage : ""
    })
  }

  /**
   * Change la méthode de calcul des coûts
   */
  changeCalculCharge(event : Event){
    this.globalFT.header.isCalculCharge = !this.globalFT.header.isCalculCharge;
  }

  /**
   * Round number to show
   * @param number
   */
  roundNumber(number : number) : string{
    return number.toFixed(2).toString().replace(".", ",")
  }

  /**
   * Get Type route
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
   * Récupère la fiche technique de la page lecture ou modification
   */
  getFicheTechnique(){
    let sub = this.ficheTechniqueService.getFicheTechnique(this.id).subscribe(
      (fiche) => {
        sub.unsubscribe();
        this.globalFT.header = fiche.header;
        this.globalFT.materielSpecifique = fiche.materielSpecifique;
        this.globalFT.materielDressage = fiche.materielDressage;

        fiche.progression.forEach((value)=>{
          if(value.identification){ // sous-fiche-technique
            this.globalFT.progression.push(value)
            this.tabValiditeForm.push(true);
          }
          else{ // étape
              this.ajoutEtape(value.etapes[0].contenu, value.etapes[0].identification)
          }
        })
        this.updateForm(); // on met a jour le formulaire avec les valeurs de la fiche technique
        this.enregistreGlobalFicheTechnique(); // on calcule ses coûts
        this.tabs.setActiveTab(1) // active le tab de la première étape
      }
    );
  }

  /**
   * Récupère tous les ingrédients de la base de données
   */
  getAllIngredients(){
    let sub = this.ingredientService.getAllIngredients().subscribe(
      (ingredients) => {
        sub.unsubscribe();
        this.tabIngredient = ingredients;
      }
    );
  }

  /**
   * Récupère toutes les recettes de la base de données
   */
  getAllCategorieRecette(){
    let sub = this.categoreRecetteService.getAllCategorieRecettes().subscribe(
      (recettes) =>{
        sub.unsubscribe();
        this.tabCategorieRecette = recettes;
      }
    )
  };

  /**
   * Récupère toutes les noms des fiche techniques
   */
  getAllNameFichesTechnique(){
    let sub = this.ficheTechniqueService.getAllNameFichesTechnique().subscribe(
      (names)=>{
        sub.unsubscribe();
        this.listNameFichesTechniques = names.filter(fiche=> fiche.id != this.id); // on enlève notre fiche technique
      }
    )
  }


  /**
   * Action pour changé l'input des catégories des recettes
   */
  onChangeTypeInput(){
    this.select=!this.select
    if(this.select){
      this.ficheTechniqueGroupe.controls["categorie"].setValidators([Validators.required]);
      this.ficheTechniqueGroupe.controls["categorie_text"].clearValidators();
    } else {
      this.ficheTechniqueGroupe.controls["categorie_text"].setValidators([Validators.required]);
      this.ficheTechniqueGroupe.controls["categorie"].clearValidators();
    }
    this.ficheTechniqueGroupe.controls["categorie_text"].updateValueAndValidity()
    this.ficheTechniqueGroupe.controls["categorie"].updateValueAndValidity()
  }

  /**
   * Return Vrai si tous les formulaire des étapes + celui du header sont valide
   * @param afficheMsg
   */
  isValidate(afficheMsg : boolean = true) : boolean{
    let isValidateEtapes = true;
    let message = "";
    this.tabValiditeForm.forEach((isValidEtape, index ) =>{
      if(!isValidEtape){ message = "Il manque des données à entrer dans l'étape n°"+(index+1)+"\n"; }
      isValidateEtapes = isValidateEtapes && isValidEtape
    })
    // ajoute la validité du formulaire du header et le fait d'avoir au moins une étape.
    let isValidateHeader = this.ficheTechniqueGroupe.valid && this.globalFT.progression.length > 0;
    if(!isValidateHeader) {  message = "Il manque des données à entrer dans le header de la fiche technique (il faut au moins 1 étape)"}

    if(!(isValidateHeader && isValidateEtapes) && afficheMsg){ // non valide
      this.toastr.warning(message,"Invalidité formulaire");
    }

    return isValidateEtapes && isValidateHeader;
  }

  /**
   * Emission des validités des étapes
   * @param i
   * @param isValide
   */
  etapeEmit(i: number, isValide: boolean){
    this.tabValiditeForm[i] = isValide;
  }

  /**
   * Event lancé lors du changement des onglets
   * Ici, on enregistre la fiche technique afin d'affichet sa gestion des calculs
   * @param event
   */
  onTabChange(event : MdbTabChange){
    if(event.index == this.globalFT.progression.length + 1){ // tab calcul
      this.enregistreGlobalFicheTechnique();
    }
  }

  /**
   * Evenement lors du click sur le bouton "Créer ma fiche technique"
   * Enregistre la fiche technique (globalFT) dans la base de données
   */
  onSubmit(){
    if(!this.isValidate()){
      return;
    }
    this.enregistreGlobalFicheTechnique();
    if(this.globalFT){
      if(!this.isPageLecture && !this.isPageModif){ // page de création
        this.ficheTechniqueService.createFicheTech(this.globalFT, !this.select).then((value)=>{
          this.toastr.success(value, 'Enregistrement effectué');
          this.router.navigate([""]);
        }).catch((error)=>{
          this.toastr.error(error, 'Erreur d\'enregistrement');
        })
      }
      else if(this.isPageModif){ // page de modification
        this.ficheTechniqueService.updateFicheTech(this.globalFT, !this.select).then((value)=>{
          if(!this.select){ // on a crée une nouvelle catégorie
            this.tabCategorieRecette!.push(new CategorieRecette(this.globalFT.header.categorie));
            this.select = true;
            this.updateForm();
          }
          this.toastr.success(value, 'Enregistrement effectué');
          this.router.navigate(["Fiche-Techniques/Lecture/"+this.id]);
        }).catch((error)=>{
          this.toastr.error(error, 'Erreur d\'enregistrement');
        });
      }

    }
  }

  /**
   * Créer la fiche technique que l'on va enregistrer dans la base de données grâce à tous les formulaires
   * Met à jours tous les inputs dans l'objet globalFT représentant la fiche technique.
   */
  enregistreGlobalFicheTechnique(){
    // On enregistre les valeurs dans le header de la fiche techniques
    this.globalFT.header.nomPlat = this.ficheTechniqueGroupe.get("nom")?.value;
    this.globalFT.header.nbrCouvert = this.ficheTechniqueGroupe.get("nombreDeCouvert")?.value;
    this.globalFT.header.nomAuteur = this.ficheTechniqueGroupe.get("auteur")?.value;
    this.globalFT.header.coutMoyenHorraire = this.ficheTechniqueGroupe.get("coutMoyenHorraire")?.value;
    this.globalFT.header.coutForfaitaire = this.ficheTechniqueGroupe.get("coutFluide")?.value;
    this.globalFT.header.coefPrixDeVente = this.ficheTechniqueGroupe.get("coefPrixDeVente")?.value;
    this.globalFT.header.coefCoutProduction = this.ficheTechniqueGroupe.get("coefCoutDeProduction")?.value;

    if (this.select){ // on a prit une catégorie déjà existante
      this.globalFT.header.categorie = this.ficheTechniqueGroupe.get("categorie")?.value;
    } else { // on a créé une nouvelle catégorie
      this.globalFT.header.categorie = this.ficheTechniqueGroupe.get("categorie_text")?.value;
    }

    this.globalFT.materielSpecifique = this.ficheTechniqueGroupe.get("materielSpecifique")?.value != ""? this.ficheTechniqueGroupe.get("materielSpecifique")?.value : undefined;

    this.globalFT.materielDressage = this.ficheTechniqueGroupe.get("materielDressage")?.value != ""? this.ficheTechniqueGroupe.get("materielDressage")?.value : undefined;

    this.globalFT.calculDureeEtCoutMatiere(); // on recalcul la durée total et le coût matière avec les nouvelles valeurs
    this.listDenreeRecette = this.globalFT.getListDenree();
  }


  /**
   * Ajout une etape dans la fiche technique
   */
  ajoutEtape(denree : Denree[] = [], description : Description = new Description("etape","description",0)){
    this.globalFT.progression.push(new EtapeList_Fiche([new Etape(description, denree)]))
    this.tabValiditeForm.push(false);
    if(denree.length === 0) { // ajout manuellement de l'étape
      setTimeout(() => {
        this.tabs.setActiveTab(this.globalFT.progression.length - 1) // active le tab de la nouvelle étape
      }, 50)
    }
  }

  /**
   * Suppression etape
   * @param i
   */
  removeEtape(i : number){
    swal.fire({
      title: 'Voulez-vous supprimer l\'étape ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4caf50',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.globalFT.progression.splice(i, 1);
        this.tabValiditeForm.splice(i, 1);
      }
    });
  }

  /**
   * Deplace une étape dans la liste
   * @param i
   * @param sens
   */
  deplaceEtape(i : number, sens : string){
    if(this.globalFT){
      if(sens == "droite" && i < this.globalFT.progression.length-1){
        [this.globalFT.progression[i], this.globalFT.progression[i+1]] = [this.globalFT.progression[i+1],this.globalFT.progression[i]];
        [this.tabValiditeForm[i],this.tabValiditeForm[i+1] ] = [this.tabValiditeForm[i+1],this.tabValiditeForm[i]]
      }
      else if(sens == "gauche" && i > 0){
        [this.globalFT.progression[i], this.globalFT.progression[i-1]] = [this.globalFT.progression[i-1],this.globalFT.progression[i]];
        [this.tabValiditeForm[i],this.tabValiditeForm[i-1] ] = [this.tabValiditeForm[i-1],this.tabValiditeForm[i]]
      }
    }
  }


  /**
   * Ecouteur d'évenement de la recherche de fiche technique pour l'ajout de sous-fiche-technique
   * @param value
   */
  handleChangesSearchFT(value : string) {
    if (value && value != "" && value.length > 1) {
      this.ajoutFicheTechnique(value);
    }
  }

  /**
   * Ajoute une etape sous-Fiche-Technique à partir de son id de la base de données
   * @param idFiche
   * @param init
   */
  ajoutFicheTechnique(idFiche : string, init : boolean = false){
    if(init || (this.listNameFichesTechniques &&
      this.listNameFichesTechniques.filter(value => value.id == idFiche).length == 1 && // la valeur est contenue dans la liste
      (this.id != idFiche) && // On ne peut pas s'ajouter soi-même en étape
      this.globalFT.progression.filter(etapeList => etapeList.identification && etapeList.identification == this.listNameFichesTechniques!.filter(value => value.id == idFiche)[0].nom).length == 0
      // la fiche technique n'est pas déjà une étape (éviter doublon)
    ))
    {
      let sub = this.ficheTechniqueService.getFicheTechnique(idFiche).subscribe((fiche : GlobalFicheTechnique)=>{
        sub.unsubscribe();
        // on regarde si elle a le même nombre de couvert
        if(fiche.header.nbrCouvert != this.globalFT.header.nbrCouvert) {
          swal.fire({
            title: 'Nombre de couvert différent détecté ('+this.globalFT.header.nbrCouvert+" - "+fiche.header.nbrCouvert+') \n Voulez-vous quand même l\'ajouter ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#4caf50',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler'
          }).then((result) => {
            if (result.isConfirmed) {
              this.globalFT.progression.push(
                new EtapeList_Fiche(fiche.getTabEtape(),fiche.header.nomPlat)
              )
              this.tabValiditeForm.push(true);

              setTimeout(()=>{
                this.tabs.setActiveTab(this.globalFT.progression.length-1)
              },50)
            }
          });
        }
        else{
          this.globalFT.progression.push(
            new EtapeList_Fiche(fiche.getTabEtape(),fiche.header.nomPlat)
          )
          this.tabValiditeForm.push(true);

          setTimeout(()=>{
            this.tabs.setActiveTab(this.globalFT.progression.length-1)
          },50)
        }
      })

    }
    else{
      this.toastr.warning("Vous ne pouvez pas ajouter une sous-fiche technique plusieurs fois !","Attention")
    }
  }
}
