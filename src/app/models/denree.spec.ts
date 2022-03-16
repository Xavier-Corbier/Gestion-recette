import { Denree } from './denree';
import {Ingredient} from "./ingredient";

describe('Denree', () => {
  it('should create an instance', () => {
    expect(new Denree(new Ingredient("",5,5,"","",[]),4)).toBeTruthy();
  });
});
