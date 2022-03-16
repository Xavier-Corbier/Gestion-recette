import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FicheTechnique} from "../../../../models/fiche-technique";
import {PrintPdfService} from "../../../../services/print-pdf.service";
import {GlobalFicheTechnique} from "../../../../models/global-fiche-technique";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-impression-fiche',
  templateUrl: './impression-fiche.component.html',
  styleUrls: ['./impression-fiche.component.css']
})

/**
 * Component pour permettre d'imprimmer la fiche technique
 */
export class ImpressionFicheComponent implements OnInit {
  printGroupe!: FormGroup;
  date : string = "";
  @Input() ficheTechnique! : GlobalFicheTechnique ;
  @Input() globalFT! : GlobalFicheTechnique;

  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private printPdfService : PrintPdfService
  ) { }

  ngOnInit(): void {
    this.initForm()
    let date=new Date();
    this.date =this.datepipe.transform(date, 'dd-MM-yyyy')!;
  }

  /**
   * Initialisation du formulaire pour imprimmer
   */
  initForm(){
    this.printGroupe = this.fb.group({
      withCost : [true, Validators.required]
    })
  }

  /**
   * Action pour imprimmer
   */
  printFiche(){
    let costBool = this.printGroupe.value.withCost;
    if(costBool){
      let fiche = document.getElementById('fiche')!;
      this.printPdfService.ficheWithCoastAsPDF(fiche);
    } else {
      let fiche = document.getElementById('fiche-technique')!;
      this.printPdfService.ficheAsPDF(fiche);
    }
  }

  /**
   * Arrondi le nombre à afficher
   * @param number
   */
  roundNumber(number : number) : string{
    return number.toFixed(2).toString().replace(".", ",")
  }
}
