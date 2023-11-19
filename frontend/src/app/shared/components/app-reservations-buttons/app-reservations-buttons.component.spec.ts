import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReservationsButtonsComponent } from './app-reservations-buttons.component';

describe('AppReservationsButtonsComponent', () => {
  let component: AppReservationsButtonsComponent;
  let fixture: ComponentFixture<AppReservationsButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppReservationsButtonsComponent]
    });
    fixture = TestBed.createComponent(AppReservationsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
