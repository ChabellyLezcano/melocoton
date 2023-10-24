import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute
import { BlogService } from 'src/app/protected/services/blog.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-photo-game',
  templateUrl: './upload-photo-article.component.html'
})
export class UploadPhotoArticleComponent {
  selectedFile: File | null = null;
  articleId: string;

  constructor(private blogService: BlogService, private route: ActivatedRoute, private router: Router) {
    this.articleId = this.route.snapshot.params['id'];
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
    if (this.selectedFile) {
      this.blogService.updateArticlePhoto(this.articleId, this.selectedFile).subscribe(
        (response) => {
          console.log('Foto actualizada con éxito', response);
  
          // Mostrar SweetAlert de éxito
          Swal.fire('Éxito', 'Foto actualizada con éxito', 'success');
  
          // Redirige a la página game/:gameId
          this.router.navigate([`/dashboard/article/${this.articleId}`]);
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
