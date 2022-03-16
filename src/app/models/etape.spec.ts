import { Etape } from './etape';
import {Description} from "./description";

describe('Etape', () => {
  it('should create an instance', () => {
    expect(new Etape(new Description("","",5),[])).toBeTruthy();
  });
});
