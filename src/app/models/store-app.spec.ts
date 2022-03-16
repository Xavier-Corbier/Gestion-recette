import { StoreApp } from './store-app';

describe('StoreApp', () => {
  it('should create an instance', () => {
    expect(new StoreApp(5,5,5,5)).toBeTruthy();
  });
});
