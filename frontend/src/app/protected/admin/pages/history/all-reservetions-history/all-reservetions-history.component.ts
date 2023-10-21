import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservationAdmin.service';

// Importa las interfaces de Reservation, Game y User
import { Reservation } from '../../../interfaces/reservationInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-reservetions-history',
  templateUrl: './all-reservetions-history.component.html'
})
export class AllReservetionsHistoryComponent implements OnInit {
  reservations: Reservation[] = [];
  selectedStatus: string = 'all';
  displayAcceptDialog: boolean = false;
  displayRejectDialog: boolean = false;
  selectedReservationId: string = '';
  expirationDate!: Date;
  rejectionReason: string = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.getAllReservations();
  }


  getAllReservations() {
    this.reservationService.getAdminReservations().subscribe(
      (response: { ok: boolean; reservations: Reservation[] }) => {
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

  showAcceptDialog(reservationId: string) {
    this.selectedReservationId = reservationId;
    this.displayAcceptDialog = true;
  }

  showRejectDialog(reservationId: string) {
    this.selectedReservationId = reservationId;
    this.displayRejectDialog = true;
  }


  filterReservations(status: string) {
    this.selectedStatus = status;
    
    if (status === 'all') {
      this.getAllReservations(); // Load all reservations
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

  acceptReservation() {
    this.reservationService.acceptReservation(this.selectedReservationId, this.expirationDate).subscribe(
      (response) => {
        if (response.ok) {
          this.displayAcceptDialog = false;
          // Muestra una notificación de éxito
          Swal.fire('Éxito', response.msg, 'success')
            .then(() => {
              // Recarga la lista de reservaciones después de aceptar la reserva
              this.getAllReservations();
            });
        } else {
          // Muestra una notificación de error
          Swal.fire('Error', response.msg, 'error');
          console.error('Error al aceptar la reserva:', response.msg);
        }
      },
      (error) => {
        // Muestra una notificación de error
        Swal.fire('Error', 'Error en la solicitud de aceptar la reserva', 'error');
        console.error('Error en la solicitud de aceptar la reserva:', error);
      }
    );
  }
  

  rejectReservation() {
    this.reservationService.rejectReservation(this.selectedReservationId, this.rejectionReason).subscribe(
      (response) => {
        if (response.ok) {
          this.displayRejectDialog = false;
          // Muestra una notificación de éxito
          Swal.fire('Éxito', response.msg, 'success')
            .then(() => {
              // Recarga la lista de reservaciones después de aceptar la reserva
              this.getAllReservations();
            });
        } else {
          // Muestra una notificación de error
          Swal.fire('Error', response.msg, 'error');
          console.error('Error al aceptar la reserva:', response.msg);
        }
      },
      (error) => {
        // Muestra una notificación de error
        Swal.fire('Error', 'Error en la solicitud de aceptar la reserva', 'error');
        console.error('Error en la solicitud de aceptar la reserva:', error);
      }
    );
  }

// Marcar la reserva como "Picked up"
markAsPickedUpReservation(reservationId: string) {
  // Verificar si se proporcionó un ID de reserva
  if (!reservationId) {
    console.error('No se proporcionó un ID de reserva.');
    return;
  }

  // Mostrar un Sweet Alert de confirmación
  Swal.fire({
    title: 'Confirmar',
    text: '¿Estás seguro de que deseas marcar la reserva como "Picked up"?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // El usuario confirmó la acción, proceder a llamar al servicio
      this.reservationService.markAsPickedUp(reservationId).subscribe(
        (response) => {
          if (response.ok) {
            // La reserva se marcó como "Picked up" con éxito
            Swal.fire('Éxito', response.msg, 'success')
              .then(() => {
                this.getAllReservations();
              });
          } else {
            // Hubo un error al marcar la reserva
            console.error('Error al marcar la reserva como "Picked up". Mensaje: ' + response.msg);
            // Puedes mostrar una notificación de error al usuario si es necesario
            Swal.fire('Error', response.msg, 'error');
          }
        },
        (error) => {
          // Error en la solicitud al servicio
          console.error('Error en la solicitud al marcar como "Picked up":', error);
          // Puedes mostrar una notificación de error al usuario si es necesario
          Swal.fire('Error', 'Error en la solicitud al marcar como "Picked up"', 'error');
        }
      );
    }
  });
}
  
// Marcar la reserva como "Picked up"
markAsCompletedReservation(reservationId: string) {
  // Verificar si se proporcionó un ID de reserva
  if (!reservationId) {
    console.error('No se proporcionó un ID de reserva.');
    return;
  }

  // Mostrar un Sweet Alert de confirmación
  Swal.fire({
    title: 'Confirmar',
    text: '¿Estás seguro de que deseas marcar la reserva como "Completed"?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      // El usuario confirmó la acción, proceder a llamar al servicio
      this.reservationService.markAsCompleted(reservationId).subscribe(
        (response) => {
          if (response.ok) {
            // La reserva se marcó como "Picked up" con éxito
            Swal.fire('Éxito', response.msg, 'success')
              .then(() => {
                this.getAllReservations();
              });
          } else {
            // Hubo un error al marcar la reserva
            console.error('Error al marcar la reserva como "Completada: ' + response.msg);
            // Puedes mostrar una notificación de error al usuario si es necesario
            Swal.fire('Error', response.msg, 'error');
          }
        },
        (error) => {
          // Error en la solicitud al servicio
          console.error('Error en la solicitud al marcar como "Picked up":', error);
          // Puedes mostrar una notificación de error al usuario si es necesario
          Swal.fire('Error', 'Error en la solicitud al marcar como "Picked up"', 'error');
        }
      );
    }
  });
}
  
}
