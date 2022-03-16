import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressionEtiquetteComponent } from './impression-etiquette.component';

describe('ImpressionEtiquetteComponent', () => {
  let component: ImpressionEtiquetteComponent;
  let fixture: ComponentFixture<ImpressionEtiquetteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpressionEtiquetteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressionEtiquetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
