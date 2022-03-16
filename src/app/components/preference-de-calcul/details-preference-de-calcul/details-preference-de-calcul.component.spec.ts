import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPreferenceDeCalculComponent } from './details-preference-de-calcul.component';

describe('DetailsPreferenceDeCalculComponent', () => {
  let component: DetailsPreferenceDeCalculComponent;
  let fixture: ComponentFixture<DetailsPreferenceDeCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsPreferenceDeCalculComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPreferenceDeCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
