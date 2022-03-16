import { Component, OnInit } from '@angular/core';
import {UtilisateurService} from "../../services/utilisateur.service";
import {Subscription} from "rxjs";
import swal from 'sweetalert2';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

/**
 * Component pour gérer le menu de la page
 */
export class HeaderComponent implements OnInit {

  estConnecte : boolean = false;
  estAdmin : boolean = false;
  SubscriptionUser : Subscription | undefined ; // suit l'utilisateur connecté
  uidUser : string | undefined;

  constructor(private utilisateurService : UtilisateurService,
              private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    // On regarde si un utilisateur s'était déjà connecté avant
    this.utilisateurService.checkSessionStorage();

    // la fonction va se lancer à chaque fois que UtilisateurService émit le currentUser
    this.SubscriptionUser = this.utilisateurService.getCurrentUser().subscribe(
      (utilisateur) => {
        if(utilisateur){ // il y a un utilisateur connecté
          this.estConnecte = true;
          this.uidUser = utilisateur.uid;
          this.estAdmin = utilisateur.getDroitAdmin();
        }
        else{
          this.estConnecte = false;
          this.uidUser = undefined;
          this.estAdmin = false;
        }
      }
    );
   }

  /**
   * Action pour se déconnecter
   */
  onDeconnexion(){
     swal.fire({
       title: 'Voulez-vous vous deconnecter?',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#4caf50',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Deconnexion',
       cancelButtonText: 'Annuler'
     }).then((result) => {
       if (result.isConfirmed) {
         this.utilisateurService.deconnexion();
         this.toastr.success('Déconnexion effectuée','Déconnexion')
       }
     })
   }
}
