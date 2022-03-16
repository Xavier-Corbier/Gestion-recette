import { Vente } from './vente';

describe('Vente', () => {
  it('should create an instance', () => {
    expect(new Vente(5,new Date(),"")).toBeTruthy();
  });
});
