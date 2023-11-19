import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.css']
})
export class ReservationItemComponent {

  @Input() reservation: any;
  @Input() reservations: any;
}
