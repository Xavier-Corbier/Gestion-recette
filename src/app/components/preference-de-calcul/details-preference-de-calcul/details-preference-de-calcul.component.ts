import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import {StoreAppService} from "../../../services/store-app.service";
import {StoreApp} from "../../../models/store-app";
import {ManageDatabaseService} from "../../../services/manage-database.service";

@Component({
  selector: 'app-details-preference-de-calcul',
  templateUrl: './details-preference-de-calcul.component.html',
  styleUrls: ['./details-preference-de-calcul.component.css']
})

/**
 * Component pour afficher les preference de calcul
 */
export class DetailsPreferenceDeCalculComponent implements  OnInit {
  store? : StoreApp;
  preferenceGroupe!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private manageDatabaseService : ManageDatabaseService,
              private storeAppService : StoreAppService) {
  }

  ngOnInit(): void {
    this.initForm()
    this.getStore()
  }

  /**
   * Récupère le store dans la base de données
   */
  getStore(){
    this.storeAppService.getStore().subscribe(
      (store) => {
        this.store = store;
        this.updateForm();
      }
    );
  }

  /**
   * Initialise le formulaire pour le store
   */
  initForm(){
    this.preferenceGroupe = this.fb.group({
      coutMoyen: ['',Validators.required],
      coutForfaitaire: ['',Validators.required],
      coefPrixDeVente: ['',Validators.required],
      coefCoutProduction: ['',Validators.required]
    })
  }

  /**
   * Mise à ajour du formulaire avec la valeur courante du store
   */
  updateForm(){
    this.preferenceGroupe.patchValue({
      coutMoyen: this.store!.coûtMoyen,
      coutForfaitaire: this.store!.coûtForfaitaire,
      coefPrixDeVente: this.store!.coefPrixDeVente,
      coefCoutProduction: this.store!.coefCoûtProduction
    })
  }

  /**
   * Action quand on clique sur l'envoie du formulaire
   */
  onSubmit() {
    let coutMoyen = this.preferenceGroupe.value.coutMoyen;
    let coutForfaitaire = this.preferenceGroupe.value.coutForfaitaire;
    let coefPrixDeVente = this.preferenceGroupe.value.coefPrixDeVente;
    let coefCoutProduction = this.preferenceGroupe.value.coefCoutProduction;
    if(coutMoyen!=""&&coutForfaitaire!=""&&coefPrixDeVente!=""&&coefCoutProduction!=""){
      let store = new StoreApp(coutMoyen, coutForfaitaire, coefPrixDeVente,coefCoutProduction);
      this.submitValue(store)
    } else {
      this.toastr.error('Verifiez les valeurs que vous avez entré', 'Erreur d\'enregistrement');
    }
  }

  /**
   * Envoie de la nouvelle valeur dans la base de données
   * @param store
   */
  submitValue(store : StoreApp) : void{
    this.storeAppService.updateStore(store).then(() => {
      this.toastr.success('Vos données sont sauvegardées', 'Enregistrement effectué');
    })
    .catch(() => {
      this.toastr.error('Vos données ne sont pas sauvegardées', 'Erreur d\'enregistrement');
    })
  }

  /**
   * Fonction caché pour mettre à jour la base de données
   */
  updateDatabase(){
    this.manageDatabaseService.updateDatabase();
  }
}
