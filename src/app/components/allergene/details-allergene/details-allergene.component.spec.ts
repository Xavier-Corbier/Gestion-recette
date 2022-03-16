import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAllergeneComponent } from './details-allergene.component';

describe('DetailsAllergeneComponent', () => {
  let component: DetailsAllergeneComponent;
  let fixture: ComponentFixture<DetailsAllergeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsAllergeneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAllergeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
