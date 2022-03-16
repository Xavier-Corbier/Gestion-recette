import { Etiquette } from './etiquette';

describe('Etiquette', () => {
  it('should create an instance', () => {
    expect(new Etiquette("","",[],new Date(),"")).toBeTruthy();
  });
});
