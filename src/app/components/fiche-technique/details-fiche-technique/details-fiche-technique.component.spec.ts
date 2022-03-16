import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFicheTechniqueComponent } from './details-fiche-technique.component';

describe('DetailsFicheTechniqueComponent', () => {
  let component: DetailsFicheTechniqueComponent;
  let fixture: ComponentFixture<DetailsFicheTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFicheTechniqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFicheTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
