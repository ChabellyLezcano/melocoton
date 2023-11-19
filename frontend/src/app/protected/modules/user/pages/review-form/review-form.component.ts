import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewResponse } from 'src/app/protected/interfaces/reviewInterface';
import { ReservationUserService } from 'src/app/protected/services/reservationUser.service';
import { ReviewService } from 'src/app/protected/services/review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html'
})
export class ReviewFormComponent {

  reviewForm: FormGroup; // Define el FormGroup
  gameId: string;

  constructor(private reviewService: ReviewService, private router: Router, private route: ActivatedRoute) {
    this.gameId = this.route.snapshot.params['id'];
    this.reviewForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      rating: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)])
    });
  }

  createReview(gameId: string) {
    this.reviewService.createReview(gameId, this.reviewForm.value)
      .subscribe((response: ReviewResponse) => {
        if (response.ok) {
          // La reseña se creó con éxito
          // Puedes realizar acciones adicionales aquí si es necesario
          // Por ejemplo, actualizar la lista de reservaciones o mostrar un mensaje de éxito
          Swal.fire('Éxito', 'Reseña creada correctamente', 'success');
          this.router.navigate(['/dashboard/game', gameId]);
        } else {
          // Manejo de errores si la creación de la reseña falla
          console.error('Error al crear la reseña: ' + response.msg);
          Swal.fire('Error', 'No se pudo crear la reseña', 'error');
        }
      });
  }
  
}
