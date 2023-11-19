import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, ReservationResponse } from 'src/app/protected/interfaces/reservationInterface';
import { ReservationService } from 'src/app/protected/services/reservationAdmin.service';
import { ReservationUserService } from 'src/app/protected/services/reservationUser.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations-user',
  templateUrl: './reservations-user.component.html'
})
export class ReservationsUserComponent {
 reservations: Reservation[] = [];
 selectedStatus: string = 'all';

  constructor(private reservationUserService: ReservationUserService,private reservationService: ReservationService, private router: Router) {}

  ngOnInit() {
    this.getUserReservationHistory()
  }

  filterReservations(status: string) {
    this.selectedStatus = status;
    
    if (status === 'all') {
      this.getUserReservationHistory(); // Load all reservations
    } else {
      this.reservationService.getReservationsByStatus(status).subscribe(
        (response) => {
          if (response.ok) {
            this.reservations = response.reservations;
          } else {
            console.error('Error al obtener las reservaciones:', response.ok);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }

  // Función para obtener el historial de reservaciones del usuario
  getUserReservationHistory() {
    this.reservationUserService.getUserReservationHistory()
      .subscribe((response: ReservationResponse) => {
        if (response.ok) {
          this.reservations = response.reservations
          // La lista de reservaciones del usuario está en response.reservations
          console.log('Historial de reservaciones:', response.reservations);
        } else {
          // Manejo de errores si la obtención del historial falla
          console.error('Error al obtener el historial de reservaciones: ' + response.msg);
        }
      });
  }

  cancelReservation(reservationId: string) {
    // Mostrar un cuadro de diálogo de confirmación antes de la cancelación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas realmente cancelar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirmó la cancelación, llama al servicio para cancelar la reserva
        this.reservationUserService.cancelReservation(reservationId)
          .subscribe((response: ReservationResponse) => {
            if (response.ok) {
              // La reservación se canceló con éxito
              this.getUserReservationHistory();
              // Mostrar un cuadro de diálogo de éxito
              Swal.fire('Éxito', 'La reserva se canceló correctamente', 'success');
            } else {
              // Manejo de errores si la cancelación de la reservación falla
              console.error('Error al cancelar la reservación: ' + response.msg);
              Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
            }
          });
      }
    });
  }

  navigateToReviewPage(gameId: string) {
    const reviewPageRoute = `/user/review/${gameId}`;
    this.router.navigate([reviewPageRoute]);
  }
  
}