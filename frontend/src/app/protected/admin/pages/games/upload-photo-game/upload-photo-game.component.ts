import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute
import { GameService } from '../../../services/games.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-photo-game',
  templateUrl: './upload-photo-game.component.html'
})
export class UploadPhotoGameComponent {
  selectedFile: File | null = null;
  gameId: string;

  constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router) {
    this.gameId = this.route.snapshot.params['id'];
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
    if (this.selectedFile) {
      this.gameService.updateBoardGamePhoto(this.gameId, this.selectedFile).subscribe(
        (response) => {
          console.log('Foto actualizada con éxito', response);
  
          // Mostrar SweetAlert de éxito
          Swal.fire('Éxito', 'Foto actualizada con éxito', 'success');
  
          // Redirige a la página game/:gameId
          this.router.navigate([`/game/${this.gameId}`]);
        },
        (error) => {
          console.error('Error al actualizar la foto', error);
  
          // Mostrar SweetAlert de error
          Swal.fire('Error', 'Error al actualizar la foto', 'error');
        }
      );
    } else {
      console.error('Debes seleccionar un archivo antes de cargarlo.');
  
      // Mostrar SweetAlert de advertencia
      Swal.fire('Advertencia', 'Debes seleccionar un archivo antes de cargarlo', 'warning');
    }
  }
  
}
