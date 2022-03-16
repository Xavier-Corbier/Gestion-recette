import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})

/**
 * Service pour imprimmer les différents pdf
 */
export class PrintPdfService {

  constructor() { }

  /**
   * Impression du pdf étiquette
   * @param etiquette
   * @param number
   */
  public etiquettesAsPDF(etiquette : HTMLElement, number : number) {
    html2canvas(etiquette,{scale: 3}).then(canvas => {
      var imgWidth = 70;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      for (let i = 0; i<number; i++){
        let height = 0;
        while( height<297-imgHeight && i<number){
          let width = 0;
          while ( width<210 && i<number){
            pdf.addImage(contentDataURL, 'PNG', width, height, imgWidth, imgHeight)
            width+=imgWidth
            i++
          }
          height+=imgHeight
        }
        i--
        if(i<number-1){
          pdf.addPage()
        }
      }
      pdf.save('etiquettes.pdf'); // Generated PDF
    });

  }

  /**
   * Impression du pdf fiche
   * @param fiche
   */
  public ficheAsPDF(fiche : HTMLElement) {
    var opt = {
      margin:       10,
      filename:     'fiche.pdf',
      pageBreak: {avoid: 'tr'},
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 1 },
      jsPDF:        { unit: 'mm', format: 'A4', orientation: 'portrait', fontSize : 6 }
    };
    html2pdf().from(fiche).set(opt).save();
  }

  /**
   * Impression du pdf fiche avec coûts
   * @param fiche
   */
  public ficheWithCoastAsPDF(fiche : HTMLElement) {
    var opt = {
      margin:       10,
      filename:     'fiche.pdf',
      pageBreak:    {after: '.page-break-pdf',avoid: ['tr','.page-break-pdf'],},
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 1 },
      jsPDF:        { unit: 'mm', format: 'A4', orientation: 'portrait', fontSize : 6 }
    };
    html2pdf().from(fiche).set(opt).save();
  }
}
