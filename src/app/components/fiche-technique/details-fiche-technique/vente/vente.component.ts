import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Vente} from "../../../../models/vente";
import {VenteService} from "../../../../services/vente.service";
import {DatePipe} from "@angular/common";
import {Denree} from "../../../../models/denree";

@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.css']
})

/**
 * Component pour permettre les ventes
 */
export class VenteComponent implements OnInit {
  venteGroupe!: FormGroup;
  date : string = "";
  booleanLoad : boolean = false;
  @Input() idFicheTechnique! : string ;
  @Input() listDenree? : Denree[];
  @Input() nombreCouvert! : number;

  constructor(private fb: FormBuilder,
              public datepipe: DatePipe,
              private venteService : VenteService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    let date=new Date();
    this.date =this.datepipe.transform(date, 'dd-MM-yyyy')!;
  }

  /**
   * Initialise le formulaire du component
   */
  initForm(){
    this.venteGroupe = this.fb.group({
      number: ['',Validators.required],
    })
  }

  /**
   * Action pour vendre
   */
  onVente(){
    this.booleanLoad = true
    let number = this.checkForm();
    let vente : Vente = new Vente(number,this.date,this.idFicheTechnique);
    this.venteService.addNewVente(vente).then(() => {
      this.venteService.updateStock(this.listDenree!,number, this.nombreCouvert!).then((value) => {
        this.toastr.success('Vos données sont sauvegardées', 'Enregistrement effectué');
        this.booleanLoad = false
      }).catch(() => {
        this.toastr.error('L\'impression n\'est pas lancée', 'Erreur avec la base de données');
        this.booleanLoad = false
      })
    })
    .catch(() => {
      this.toastr.error('Vos données ne sont pas sauvegardées', 'Erreur d\'enregistrement');
      this.booleanLoad = false
    })
  }

  /**
   * Vérifie les valeurs du formulaire
   * @private
   */
  private checkForm() {
    let numberForm = this.venteGroupe.value.number;
    return +numberForm;
  }
}
