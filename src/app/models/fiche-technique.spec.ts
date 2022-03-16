import { FicheTechnique } from './fiche-technique';

describe('FicheTechnique', () => {
  it('should create an instance', () => {
    expect(new FicheTechnique("","",5,5)).toBeTruthy();
  });
});
