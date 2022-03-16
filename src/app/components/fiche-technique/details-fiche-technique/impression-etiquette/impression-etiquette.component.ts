import {Component, Input, OnInit} from '@angular/core';
import {PrintPdfService} from "../../../../services/print-pdf.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import { DatePipe } from '@angular/common'
import {Etiquette} from "../../../../models/etiquette";
import {EtiquetteService} from "../../../../services/etiquette.service";
import {VenteService} from "../../../../services/vente.service";
import {Vente} from "../../../../models/vente";
import {Denree} from "../../../../models/denree";

@Component({
  selector: 'app-impression-etiquette',
  templateUrl: './impression-etiquette.component.html',
  styleUrls: ['./impression-etiquette.component.css']
})

/**
 * Component pour permettre d'imprimmer les étiquette
 */
export class ImpressionEtiquetteComponent implements OnInit {
  printGroupe!: FormGroup;
  date : string = ""
  loadBoolean : boolean = false;
  @Input() name! : string ;
  @Input() idFicheTechnique! : string ;
  @Input() listDenree? : Denree[];
  @Input() nombreCouvert! : number;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private etiquetteService : EtiquetteService,
    private venteService : VenteService,
    private printPdfService : PrintPdfService
  ) { }

  ngOnInit(): void {
    this.initForm()
    let date=new Date();
    this.date =this.datepipe.transform(date, 'dd-MM-yyyy')!;
  }

  /**
   * Initialise le formulaire pour imprimmer
   */
  initForm(){
    this.printGroupe = this.fb.group({
      number: ['',Validators.required],
      isVente : [false, Validators.required]
    })
  }

  /**
   * Action pour imprimmer
   */
  printEtiquette(){
    this.loadBoolean = true
    var number = this.checkForm();
    var isVente = this.printGroupe.value.isVente;
    if(number>0){
      if(isVente){
        this.updateIdEtiquette(number);
      } else {
        this.getEtiquettePDF(number);
      }
    } else {
      this.toastr.error('L\'impression n\'est pas lancée', 'Le nombre doit être supérieur à 0');
    }
  }

  /**
   * Récupère l'id de l'étiquette dans la base de données
   * @param number
   * @private
   */
  private updateIdEtiquette(number : number) {
    let array : {nom:string,isAllergene:boolean}[] = this.manageDenree();
    this.createEtiquette(array, number);
  }

  /**
   * Création de l'étiquette
   * @param array
   * @param number
   * @private
   */
  private createEtiquette(array: { nom: string; isAllergene: boolean }[], number: number) {
    let etiquette: Etiquette = new Etiquette(this.name, array, this.date, number, this.idFicheTechnique)
    this.etiquetteService.addNewEtiquette(etiquette).then((value) => {
      document.getElementById('id-etiquette')!.innerHTML = value;
      let vente: Vente = new Vente(number, this.date, this.idFicheTechnique);
      this.venteService.addNewVente(vente).then((value) => {
        this.venteService.updateStock(this.listDenree!,number, this.nombreCouvert!).then(() => {
          this.getEtiquettePDF(number);
          this.toastr.success(value, 'Enregistrement effectué');
        }).catch(() => {
          this.toastr.error('L\'impression n\'est pas lancée', 'Erreur avec la base de données');
        })
      }).catch(() => {
        this.toastr.error('L\'impression n\'est pas lancée', 'Erreur avec la base de données');
      })
    }).catch(() => {
      this.toastr.error('L\'impression n\'est pas lancée', 'Erreur avec la base de données');
    })
  }

  /**
   * Creation du tableau pour les denrées
   * @param array
   * @private
   */
  private manageDenree() : { nom: string; isAllergene: boolean }[] {
    let array : {nom:string,isAllergene:boolean}[] = [];
    for (let denree of this.listDenree!) {
      array.push({nom: denree.ingredient.nomIngredient, isAllergene: denree.ingredient.listAllergene.length != 0})
    }
    return array
  }

  /**
   * Récupère le pdf des étiquettes
   * @param number
   * @private
   */
  private getEtiquettePDF(number: number) {
    let etiquette = document.getElementById("etiquette");
    this.printPdfService.etiquettesAsPDF(etiquette!, number);
    this.loadBoolean = false
  }

  /**
   * Vérifie les valeurs du formulaires
   * @private
   */
  private checkForm() {
    let numberForm = this.printGroupe.value.number;
    return +numberForm;
  }
}
