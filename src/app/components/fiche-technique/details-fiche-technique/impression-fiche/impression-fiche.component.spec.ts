import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressionFicheComponent } from './impression-fiche.component';

describe('ImpressionFicheComponent', () => {
  let component: ImpressionFicheComponent;
  let fixture: ComponentFixture<ImpressionFicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpressionFicheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressionFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
