import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Utilisateur} from "../../../models/utilisateur";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details-utilisateur',
  templateUrl: './details-utilisateur.component.html',
  styleUrls: ['./details-utilisateur.component.css']
})

export class DetailsUtilisateurComponent implements OnInit {

  @Input() utilisateur? : Utilisateur;
  utilisateurGroupe! : FormGroup;
  errorMessage : string = '';
  isPageModif : boolean = false;
  isPageLecture : boolean = false;

  constructor(private fb:FormBuilder,
              private userService : UtilisateurService,
              private route : ActivatedRoute,
              private router : Router,
              private toast : ToastrService) {

  }

  /**
   * Regarde sur quel type de route on est (lecture, modification ou création)
   * Si lecture ou modificaiton, recupère l'utilisateur dans la base de données
   */
  ngOnInit(): void {
    this.isPageModif = this.route.snapshot.paramMap.has('modifId');
    this.isPageLecture = this.route.snapshot.paramMap.has('lectureId');
    let id : string | null;
    if(this.isPageModif){ // page modif
      id = this.route.snapshot.paramMap.get('modifId');
    }
    else if(this.isPageLecture) { // page lecture
      id = this.route.snapshot.paramMap.get('lectureId');
    }
    if(this.isPageLecture || this.isPageModif){
      this.userService.getUtilisateur(id!).subscribe((user) => { // get info user
        if (user) {
          this.utilisateur = user;
          this.initForm();
        } else {
          this.router.navigate([""]); // redirection pas d'user
        }
      });
    }
    this.initForm();
  }

  /**
   * Intialise les valeurs de formulaires
   */
  initForm(){
    this.utilisateurGroupe = this.fb.group({
      email : [{value :this.utilisateur == undefined? '' : this.utilisateur.email,disabled : this.isPageModif || this.isPageLecture}, [Validators.required,Validators.email]],
      password : [{value :'',disabled : this.isPageLecture},[Validators.required,Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      nom : [{value : this.utilisateur == undefined? '' : this.utilisateur.nom, disabled : this.isPageLecture},Validators.required],
      prenom : [{value : this.utilisateur == undefined? '' : this.utilisateur.prenom,disabled : this.isPageLecture} ,Validators.required],
    })
  }

  /**
   * Fonction appellé lors du click sur le bouton du formulaire
   * Enregistre/Modifie l'utilisateur dans la base de données
   */
  onSubmit(){
    const email = this.utilisateurGroupe.value.email;
    const password = this.utilisateurGroupe.value.password;
    const nom = this.utilisateurGroupe.value.nom;
    const prenom = this.utilisateurGroupe.value.prenom;
    if(this.isPageModif){
      if(password == this.utilisateur?.motdepasse){ // même mdp
        if(this.userService.updateUtilisateur(this.utilisateur!, nom, prenom)){
          this.toast.success("Le compte a bien été modifié", 'Enregistrement effectué');
        }
        else{
          this.errorMessage = "Il y a eu un problème lors de la modification"
        }
      }else{
        this.errorMessage = "Vous n'avez pas mit le bon mot de passe."
      }
    }
    else if(!this.isPageLecture && !this.isPageModif){ // pas création
      this.userService.createNewUser(nom,prenom,email,password).then(
        ()=>{ // tout se passe bien
          this.toast.success("Le compte a bien été créé","Enregistrement effectué")
          this.router.navigate(["/Utilisateurs"]);
        },
        (error)=>{
          this.errorMessage = error;
        }
      )
    }
  }

}
