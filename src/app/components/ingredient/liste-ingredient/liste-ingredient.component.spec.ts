import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIngredientComponent } from './liste-ingredient.component';

describe('ListeIngredientComponent', () => {
  let component: ListeIngredientComponent;
  let fixture: ComponentFixture<ListeIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeIngredientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
