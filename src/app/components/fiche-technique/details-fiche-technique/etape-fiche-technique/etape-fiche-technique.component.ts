import {Component, Input, OnInit} from '@angular/core';
import {EtapeList_Fiche} from "../../../../models/global-fiche-technique";

@Component({
  selector: 'app-etape-fiche-technique',
  templateUrl: './etape-fiche-technique.component.html',
  styleUrls: ['./etape-fiche-technique.component.css']
})
export class EtapeFicheTechniqueComponent implements OnInit {

  @Input() ficheTechnique! : EtapeList_Fiche;

  constructor() {
  }

  ngOnInit(): void {

  }

}
