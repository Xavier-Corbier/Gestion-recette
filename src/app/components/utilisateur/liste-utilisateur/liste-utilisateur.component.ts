import {Component, Input, OnInit} from '@angular/core';
import {UtilisateurService} from "../../../services/utilisateur.service";
import {Utilisateur} from "../../../models/utilisateur";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-liste-utilisateur',
  templateUrl: './liste-utilisateur.component.html',
  styleUrls: ['./liste-utilisateur.component.css']
})
export class ListeUtilisateurComponent implements OnInit {

  @Input() tabUser? : Utilisateur[];
  private filterSearch : string = "";
  private idPage : number = 0;
  public numberByPage : number = 10;

  constructor(private userService : UtilisateurService,
              private toast : ToastrService
              ) { }

  /**
   * Récupère tous les utilisateurs
   */
  ngOnInit(): void {
    this.userService.getAllUtilisateurs().subscribe((tabUser)=> {this.tabUser = tabUser});
  }

  /**
   * Supprime un utilisateur avec son id
   * @param uid
   */
  onClickDelete(uid:string){
    this.userService.deleteUtilisateur(uid);
    this.toast.success("Le compte a bien été supprimé","Enregistrement effectué")
  }

  /**
   * Ecouteur d'évenement sur la barre de recherche des utilisateurs
   * @param val
   */
  onSearchUtilisateur(val : string){
    this.filterSearch = val;
  }

  /**
   * Renvoie la taille du tableau filtrer
   */
  tailleTabFilter(){
    if(this.tabUser){
      const tab = this.tabUser?.filter(utilisateur => utilisateur.nom.includes(this.filterSearch) || utilisateur.prenom.includes(this.filterSearch));
      return tab.length;
    }
    return 0;
  }

  /**
   * Emission de l'id de la pagination à afficher
   * @param id
   */
  idPageEmit(id : number){
    this.idPage = id;
  }

  /**
   * Filtre les utilisateurs en fonction de la barre des recherches et de la pagination
   * @param tabUser
   */
  filter(tabUser : Utilisateur[]  | undefined) : Utilisateur[] | undefined{
    if(tabUser){
      return tabUser.filter(utilisateur => utilisateur.nom.includes(this.filterSearch) || utilisateur.prenom.includes(this.filterSearch))
        .filter((utilisateur,i) => i >= this.idPage*this.numberByPage && i < (this.idPage +1)*this.numberByPage);
    }
    return tabUser;
  }
}
