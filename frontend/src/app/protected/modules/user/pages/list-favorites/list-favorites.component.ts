import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/protected/interfaces/gameInterface';
import { FavoriteService } from 'src/app/protected/services/favorite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-favorites',
  templateUrl: './list-favorites.component.html',
})
export class ListFavoritesComponent implements OnInit {
  favoriteGames: Game[] = []; // Aquí almacenaremos los juegos favoritos
  errorMessage: string = '';

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit() {
    this.loadFavoriteGames();
  }

  // Quitar un juego como favorito
  unmarkAsFavorite(gameId: string) {
    // Preguntar al usuario si está seguro antes de desmarcar como favorito
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas desmarcar este juego como favorito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desmarcar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        // Si el usuario confirma, realizar la acción de desmarcar
        this.favoriteService.unmarkFavorite(gameId).subscribe(
          (response) => {
            if (response.ok) {
              // Muestra una notificación de éxito con SweetAlert
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Juego desmarcado como favorito',
              });

              // Actualiza la lista de juegos favoritos
              this.loadFavoriteGames();
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
    });
  }
  // Cargar la lista de juegos favoritos
  loadFavoriteGames() {
    this.favoriteService.listFavorites().subscribe(
      (response) => {
        if (response.ok) {
          // Lista de juegos favoritos cargada con éxito
          this.favoriteGames = response.games;
        } else {
          // Manejo de errores: response.msg contiene el mensaje de error
          this.errorMessage = response.msg;
        }
      },
      (error) => {
        // Manejo de errores de red u otros errores
        this.errorMessage = 'Error de red';
      }
    );
  }
}
