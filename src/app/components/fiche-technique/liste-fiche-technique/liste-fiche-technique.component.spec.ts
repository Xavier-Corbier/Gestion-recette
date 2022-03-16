import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFicheTechniqueComponent } from './liste-fiche-technique.component';

describe('ListeFicheTechniqueComponent', () => {
  let component: ListeFicheTechniqueComponent;
  let fixture: ComponentFixture<ListeFicheTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeFicheTechniqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeFicheTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
