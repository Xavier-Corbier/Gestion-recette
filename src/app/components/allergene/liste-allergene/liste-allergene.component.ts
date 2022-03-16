import {Component, Input, OnInit} from '@angular/core';
import {AllergèneService} from "../../../services/allergène.service";
import {Allergène} from "../../../models/allergène";
import swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-liste-allergene',
  templateUrl: './liste-allergene.component.html',
  styleUrls: ['./liste-allergene.component.css']
})

/**
 * Component to show the list of the allergenes
 */
export class ListeAllergeneComponent implements OnInit {
  @Input() tabAllergene? : Allergène[]
  private errorMsg : string = "";
  private filterSearch : string = "";
  private idPage : number = 0;
  public numberByPage : number = 10;

  constructor(private allergeneService : AllergèneService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.allergeneService.getAllAllergenes().subscribe(
      (tabAllergene)=> {
        if(tabAllergene){
          this.tabAllergene = tabAllergene
        }
        else{
          this.errorMsg = "Il n'y a pas d'allergènes";
        }
      });
  }

  /**
   * Action on click delete button
   * @param uid
   */
  onClickDelete(uid:string){
    swal.fire({
      title: 'Voulez-vous le supprimer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4caf50',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allergeneService.deleteAllergene(uid).then(
          (result)=> {
            this.toastr.success(result,'Enregistrement effectué')
          }).catch((error)=>{
          this.toastr.error(error,'Erreur d\'enregistrement')
        })
      }
    })
  }

  /**
   * Action on search allergene
   * @param val
   */
  onSearchAllergene(val : string){
    this.filterSearch = val;
  }

  /**
   * Renvoie la taille du tableau filtrer
   */
  tailleTabFiltrer(){
    if(this.tabAllergene){
      const tab = this.tabAllergene?.filter(allergene => allergene.nom.toLowerCase().includes(this.filterSearch.toLowerCase()));
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
   * Filter tab allergene
   * @param tabAllergene
   */
  filter(tabAllergene : Allergène[]  | undefined) : Allergène[] | undefined{
    if(tabAllergene){
      return tabAllergene.filter(allergene => allergene.nom.toLowerCase().includes(this.filterSearch.toLowerCase()))
        .filter((allergene,i) => i >= this.idPage*this.numberByPage && i < (this.idPage +1)*this.numberByPage);
    }
    return tabAllergene;
  }

}
