import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-reservations-buttons',
  templateUrl: './app-reservations-buttons.component.html'
})
export class AppReservationsButtonsComponent {

  @Output() filterChanged = new EventEmitter<string>();

  filterReservations(filter: string) {
    this.filterChanged.emit(filter);
  }
}
