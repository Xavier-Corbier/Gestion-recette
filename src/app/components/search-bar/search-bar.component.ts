import {EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Component } from '@angular/core';
import {config} from "rxjs";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

/**
 * Component pour chercher un élément
 */
export class SearchBarComponent implements OnInit {
  @Output() resultat = new EventEmitter<string>();
  @Output() resultatTab = new EventEmitter<string[]>();
  input? : any
  config = {
    displayKey: 'name',
    search: true,
    limitTo: 4,
    searchPlaceholder:'Recherche',
    noResultsFound: 'Aucun résultat',
    placeholder:'Choisir',
    moreText: 'de plus'
  };
  @Input() mutliple : boolean = false;
  @Input() nameDisplay? : string
  @Input() options : any[] = [
    {
      _id: '',
      index: 0,
      balance: '',
      picture: '',
      name: '',
    },
  ];

  constructor() {
  }

  ngOnInit() {
    if(this.nameDisplay){
      this.config.placeholder = this.nameDisplay;
    }
  }

  /**
   * Action quand on clique sur fermer
   * @param event
   */
  handleClose(event : any){
    if(!this.mutliple){
      this.input = null;
    }
  }

  /**
   * Action quand un input est choisi
   * @param $event
   */
  changeInput($event: any){
    if(this.mutliple){
      let tab : string[] = $event.map((value : any)=>value.name) ;
      this.resultatTab.emit(tab)
    }
    if(!this.mutliple && $event != [] ){
      this.resultat.emit($event._id!)
    }
  }
}
