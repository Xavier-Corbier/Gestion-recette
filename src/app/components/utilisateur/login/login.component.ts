import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  utilisateurGroupe!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
              private authService: UtilisateurService,
              private router: Router) {
  }

  /**
   * Initialise le composant
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Créer le formulaire du login
   */
  initForm() {
    this.utilisateurGroupe = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  /**
   * Lance le processus de connexion, redirige l'utilisateur s'il à réussie à se connecter
   */
  onSubmit() {
    const email = this.utilisateurGroupe.value.email;
    const password = this.utilisateurGroupe.value.password;
    this.authService.login(email, password).then(
      () => { // tout se passe bien
        this.router.navigate(["/"]);
      },
      (error) => {
        this.errorMessage = error;
      }
    )
  }
}
