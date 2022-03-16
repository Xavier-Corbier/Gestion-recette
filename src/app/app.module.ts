import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MDBBootstrapModule} from "angular-bootstrap-md";   // MDBoostrap
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {DatePipe} from '@angular/common';

// Firebase modules
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import {
  apiKey, appId,
  authDomain,
  measurementId,
  messagingSenderId,
  projectId,
  storageBucket
} from '../environments/environment';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ListeUtilisateurComponent } from './components/utilisateur/liste-utilisateur/liste-utilisateur.component';
import { DetailsUtilisateurComponent } from './components/utilisateur/details-utilisateur/details-utilisateur.component';
import { LoginComponent } from './components/utilisateur/login/login.component';
import { ListeFicheTechniqueComponent } from './components/fiche-technique/liste-fiche-technique/liste-fiche-technique.component';
import { DetailsFicheTechniqueComponent } from './components/fiche-technique/details-fiche-technique/details-fiche-technique.component';
import { DetailsAllergeneComponent } from './components/allergene/details-allergene/details-allergene.component';
import { ListeAllergeneComponent } from './components/allergene/liste-allergene/liste-allergene.component';
import { DetailsIngredientComponent } from './components/ingredient/details-ingredient/details-ingredient.component';
import { ListeIngredientComponent } from './components/ingredient/liste-ingredient/liste-ingredient.component';
import { DetailsPreferenceDeCalculComponent } from './components/preference-de-calcul/details-preference-de-calcul/details-preference-de-calcul.component';
import {AllergèneService} from "./services/allergène.service";
import {CategorieIngredientService} from "./services/categorie-ingredient.service";
import {CategorieRecetteService} from "./services/categorie-recette.service";
import {DenreeService} from "./services/denree.service";
import {DescriptionService} from "./services/description.service";
import {EtapeService} from "./services/etape.service";
import {EtiquetteService} from "./services/etiquette.service";
import {FicheTechniqueService} from "./services/fiche-technique.service";
import {IngredientService} from "./services/ingredient.service";
import {ProgressionService} from "./services/progression.service";
import {StoreAppService} from "./services/store-app.service";
import {VenteService} from "./services/vente.service";
import {UtilisateurService} from "./services/utilisateur.service";

import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AuthGuardGuard} from "./guard/auth-guard.guard";


import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { EtapeComponent } from './components/fiche-technique/details-fiche-technique/etape/etape.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { EtapeFicheTechniqueComponent } from './components/fiche-technique/details-fiche-technique/etape-fiche-technique/etape-fiche-technique.component';
import { ImpressionEtiquetteComponent } from './components/fiche-technique/details-fiche-technique/impression-etiquette/impression-etiquette.component';
import { ImpressionFicheComponent } from './components/fiche-technique/details-fiche-technique/impression-fiche/impression-fiche.component';
import { VenteComponent } from './components/fiche-technique/details-fiche-technique/vente/vente.component';
import { PaginationComponent } from './components/pagination/pagination.component';

const appRoutes : Routes = [
  {path: 'Connexion', component : LoginComponent},
  {path: 'Utilisateurs/Création', data : {roles : "admin"}, canActivate:[AuthGuardGuard], component : DetailsUtilisateurComponent},
  {path: 'Utilisateurs/Lecture/:lectureId',canActivate:[AuthGuardGuard], component : DetailsUtilisateurComponent},
  {path: 'Utilisateurs/Modification/:modifId',canActivate:[AuthGuardGuard], component : DetailsUtilisateurComponent},
  {path: 'Utilisateurs',data : {roles : "admin"},canActivate:[AuthGuardGuard], component : ListeUtilisateurComponent},

  {path: 'Allergènes', canActivate:[AuthGuardGuard], component : ListeAllergeneComponent},
  {path: 'Allergènes/Création',canActivate:[AuthGuardGuard], component : DetailsAllergeneComponent},
  {path: 'Allergènes/Lecture/:lectureId', canActivate:[AuthGuardGuard], component : DetailsAllergeneComponent},
  {path: 'Allergènes/Modification/:modifId',canActivate:[AuthGuardGuard], component : DetailsAllergeneComponent},

  {path: 'Ingrédients', canActivate:[AuthGuardGuard], component : ListeIngredientComponent},
  {path: 'Ingrédients/Création',canActivate:[AuthGuardGuard], component : DetailsIngredientComponent},
  {path: 'Ingrédients/Lecture/:lectureId', canActivate:[AuthGuardGuard], component : DetailsIngredientComponent},
  {path: 'Ingrédients/Modification/:modifId',canActivate:[AuthGuardGuard], component : DetailsIngredientComponent},

  {path: 'Préférences/Calcul',data : {roles : "admin"},canActivate:[AuthGuardGuard], component : DetailsPreferenceDeCalculComponent},

  {path: 'Fiche-Techniques', component : ListeFicheTechniqueComponent},
  {path: 'Fiche-Techniques/Création',canActivate:[AuthGuardGuard], component : DetailsFicheTechniqueComponent},
  {path: 'Fiche-Techniques/Modification/:modifId', canActivate:[AuthGuardGuard], component : DetailsFicheTechniqueComponent},
  {path: 'Fiche-Techniques/Lecture/:lectureId', component : DetailsFicheTechniqueComponent},

  {path: '', redirectTo: "Fiche-Techniques", pathMatch : "full"},
  {path: '**', redirectTo: "Fiche-Techniques"}

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListeUtilisateurComponent,
    DetailsUtilisateurComponent,
    LoginComponent,
    ListeFicheTechniqueComponent,
    DetailsFicheTechniqueComponent,
    DetailsAllergeneComponent,
    ListeAllergeneComponent,
    DetailsIngredientComponent,
    ListeIngredientComponent,
    DetailsPreferenceDeCalculComponent,
    EtapeComponent,
    SearchBarComponent,
    EtapeFicheTechniqueComponent,
    ImpressionEtiquetteComponent,
    ImpressionFicheComponent,
    VenteComponent,
    PaginationComponent,
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(), // MDBoostrap
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: apiKey,
      authDomain: authDomain,
      projectId: projectId,
      storageBucket: storageBucket,
      messagingSenderId: messagingSenderId,
      appId: appId,
      measurementId: measurementId
    }), // lien bd
    AngularFirestoreModule, // module for query
    MdbTabsModule,
    BrowserAnimationsModule,
    SelectDropDownModule,
    CommonModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  providers: [
    DatePipe,
    AllergèneService,
    UtilisateurService,
    CategorieIngredientService,
    CategorieRecetteService,
    DenreeService,
    DescriptionService,
    EtapeService,
    EtiquetteService,
    FicheTechniqueService,
    IngredientService,
    ProgressionService,
    StoreAppService,
    VenteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
