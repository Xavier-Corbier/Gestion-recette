import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapeFicheTechniqueComponent } from './etape-fiche-technique.component';

describe('EtapeFicheTechniqueComponent', () => {
  let component: EtapeFicheTechniqueComponent;
  let fixture: ComponentFixture<EtapeFicheTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtapeFicheTechniqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapeFicheTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
