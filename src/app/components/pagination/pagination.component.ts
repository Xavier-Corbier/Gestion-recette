import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {GlobalFicheTechnique} from "../../models/global-fiche-technique";
import {Etape} from "../../models/etape";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  public idPage : number = 0;
  public tabIdPage? : number[];
  public intervalAffiche : number = 2;
  @Input() numberByPage? : number = 10;
  @Input() tailleTableau? : number = 0; // taille du tableau où l'on gère la pagination
  @Output() idPageEmit = new EventEmitter<number>(); // Emission de l'id de la page à afficher

  constructor() { }

  ngOnChanges(): void {
    this.updateTabId();
  }

  /**
   * Fonction qui permet d'émettre l'id de la page aux composants parents
   */
  emitId(){
    this.idPageEmit.emit(this.idPage);
  }

  /**
   * Update id of the tab
   * @param tailleTableau
   */
  updateTabId(){
    this.tabIdPage = [];
    for(let i = 0 ; i < this.tailleTableau!; i = i + this.numberByPage!){ // on créer les id des pages
      this.tabIdPage.push(this.tabIdPage.length == 0? 0 : this.tabIdPage[this.tabIdPage.length-1] + 1)
    }

    if(this.idPage > this.tabIdPage.length -1){
      this.idPage = 0;
      this.emitId();
    }
  }

  /**
   * Filter the tab with the id of the page
   */
  filterIdPage() : number[] | null{
    if(this.tabIdPage){
      return this.tabIdPage.filter(number => Math.abs(number - this.idPage) < this.intervalAffiche); // les chiffres autour du current
    }else{
      return null;
    }
  }

  /**
   * Action on click button next
   */
  onSuivant(){
    if(this.tabIdPage){
      if(this.idPage != this.tabIdPage.length -1){
        this.idPage++;
        this.emitId();
      }
    }
  }

  /**
   * Update id page
   * @param page
   */
  onPage(page : number){
    this.idPage = page;
    this.emitId();
  }

  /**
   * Action on click button previous
   */
  onPrecedent(){
    if(this.tabIdPage){
      if(this.idPage != 0){
        this.idPage--;
        this.emitId();
      }
    }
  }

}
