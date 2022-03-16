import {Etape} from "./etape";

export class Description /*implements Etape*/{

  constructor( public nom : string,
               public description : string,
               public tempsPreparation : number // (en minute)
  )
  {

  }
}
