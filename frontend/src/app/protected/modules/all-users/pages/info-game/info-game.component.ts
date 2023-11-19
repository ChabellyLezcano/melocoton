import { Component, OnInit } from '@angular/core';
import { GameResponse } from '../../../../interfaces/gameInterface';
import { GameService } from '../../../../services/games.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/auth/service/user-data.service';
import { User } from 'src/app/auth/interfaces/authInterface';
import { FavoriteService } from 'src/app/protected/services/favorite.service';
import { ReservationResponse } from 'src/app/protected/interfaces/reservationInterface';
import { ReservationUserService } from 'src/app/protected/services/reservationUser.service';
import { ReviewService } from 'src/app/protected/services/review.service';
import { Review, ReviewResponse } from 'src/app/protected/interfaces/reviewInterface';

@Component({
  selector: 'app-info-game',
  templateUrl: './info-game.component.html'
})
export class InfoGameComponent implements OnInit {
  game: GameResponse | undefined;
  gameId: string;
  images: any[] = [];
  tagsArray: string[] = [];
  user: User | null = null; // Cambia el tipo a User | null
  isAdmin: boolean = false;
  reviews: Review[] = [];

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private router: Router,
    private favoriteService: FavoriteService,
    private reservationUserService: ReservationUserService,
    private reviewService: ReviewService
  ) {
    this.gameId = this.route.snapshot.params['id'];
    this.userDataService.userData$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (user.role === 'Admin') {
          this.isAdmin = true;
        }
      }
    });
  }

  ngOnInit(): void {
    // Llamar al servicio para obtener el juego por ID
    this.gameService.getGameById(this.gameId).subscribe(
      (response) => {
        this.game = response;
        this.tagsArray = this.game.game.tags.map(tag => tag.trim());
      },
      (error) => {
        console.error('Error al obtener el juego:', error);
      }
    );

    this.getGameReviews(this.gameId);
  }

  onAddPhotoClick(gameId: string) {
    console.log('onVerClick llamado con gameId:', gameId);
    this.router.navigate(['/admin/upload-game-photo', gameId]);
  }

  onEditClick(gameId: string) {
    console.log('onEditClick llamado con gameId:', gameId);
    this.router.navigate(['/edit-game', gameId]);
  }

  onDeleteClick(gameId: string) {
    // Mostrar una confirmación con SweetAlert2
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el juego. No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar el juego por ID
        this.gameService.deleteGame(gameId).subscribe(
          () => {
            // Mostrar un SweetAlert de éxito
            Swal.fire('Éxito', 'El juego ha sido eliminado con éxito', 'success');

            // Redirigir al usuario al panel de administración
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            // Verificar si el objeto de error tiene una propiedad 'msg' y mostrarla en el SweetAlert de error
            const errorMessage = error.msg ? error.msg : 'Error al eliminar el juego';
            Swal.fire('Error', errorMessage, 'error');
          }
        );
      }
    });
  }

  markAsFavorite(gameId: string) {
    this.favoriteService.markFavorite(gameId).subscribe(
      (response) => {
        if (response.ok) {
          // Muestra una notificación de éxito con SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Juego desmarcado como favorito',
          });

          // Puedes realizar alguna acción adicional si es necesario
        } else {
          // Muestra una notificación de error con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.msg,
          });
        }
      },
      (error) => {
        // Muestra una notificación de error de red con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'Se produjo un error al desmarcar el juego como favorito',
        });
      }
    );
  }

    // Función para crear una nueva reservación
    createReservation(gameId: string) {
      this.reservationUserService.createReservation(gameId)
        .subscribe((response: ReservationResponse) => {
          if (response.ok) {
            // La reservación se creó con éxito
            Swal.fire('Éxito', 'Reservación creada correctamente', 'success');
            // Puedes realizar acciones adicionales si es necesario
          } else {
            // Manejo de errores si la creación de la reservación falla
            console.error('Error al crear la reservación: ' + response.msg);
            Swal.fire('Error', 'No se pudo crear la reservación', 'error');
          }
        });
    }

    // Obtener reseñas de un juego específico
  getGameReviews(gameId: string): void {
    this.reviewService.getGameReviews(gameId)
      .subscribe((response) => {
      this.reviews = response.reviews
      console.log(response)
      });
  }

  // Editar una reseña existente
  editReview(reviewId: string, title: string, description: string, rating: number): void {
    this.reviewService.editReview(reviewId, title, description, rating)
      .subscribe((response: ReviewResponse) => {
        if (response.ok) {
          // La reseña se editó con éxito
          Swal.fire('Éxito', 'Reseña editada correctamente', 'success');
          // Puedes realizar acciones adicionales si es necesario
        } else {
          // Manejo de errores si la edición de la reseña falla
          console.error('Error al editar la reseña: ' + response.msg);
          Swal.fire('Error', 'No se pudo editar la reseña', 'error');
        }
      });
  }

  // Eliminar una reseña existente
  deleteReview(reviewId: string): void {
    // Mostrar una confirmación con SweetAlert2
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la reseña. No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReview(reviewId)
          .subscribe(
            () => {
              // Mostrar un SweetAlert de éxito
              Swal.fire('Éxito', 'La reseña ha sido eliminada con éxito', 'success');
              // Puedes realizar acciones adicionales si es necesario
            },
            (error) => {
              // Verificar si el objeto de error tiene una propiedad 'msg' y mostrarla en el SweetAlert de error
              const errorMessage = error.msg ? error.msg : 'Error al eliminar la reseña';
              Swal.fire('Error', errorMessage, 'error');
            }
          );
      }
    });
  }


  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
