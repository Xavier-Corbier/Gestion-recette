/*export interface Etape {

}
*/

import {Description} from "./description";
import {Denree} from "./denree";

export class Etape{
  constructor( public identification : Description,
               public contenu : Denree[]){}


  getCopyEtape() : Etape{

    const dNew : Denree[] = [];

    this.contenu.forEach((d)=>{
      dNew.push(new Denree(
        d.ingredient,
        d.number
      ))
    })

    return new Etape(
      this.identification,
      dNew)
  }

}
