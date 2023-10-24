import { Component, OnInit } from '@angular/core';
import { GameResponse } from '../../../../interfaces/gameInterface';
import { GameService } from '../../../../services/games.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/auth/service/user-data.service';
import { User } from 'src/app/auth/interfaces/authInterface';

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

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private router: Router
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
        console.log(this.game)
        this.tagsArray = this.game.game.tags.map(tag => tag.trim());
      },
      (error) => {
        console.error('Error al obtener el juego:', error);
      }
    );
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