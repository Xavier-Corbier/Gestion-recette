import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAllergeneComponent } from './liste-allergene.component';

describe('ListeAllergeneComponent', () => {
  let component: ListeAllergeneComponent;
  let fixture: ComponentFixture<ListeAllergeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeAllergeneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeAllergeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
