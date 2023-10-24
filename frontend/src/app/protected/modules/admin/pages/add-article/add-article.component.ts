import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/protected/services/blog.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html'
})
export class AddArticleComponent {
  articleForm!: FormGroup;
  photo: File | null = null; // Inicializa 'photo' con 'null'

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      title: ['Taylor Swift', Validators.required],
      text: ['El Eras Tour está arrasando', Validators.required],
      tags: ['taylorswift, erastour', Validators.required],// Asigna el FormControl 'photo' al campo 'photo' en el FormGroup
    });
  }

  onPhotoChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.photo = inputElement.files[0]; // Actualiza el valor de 'photo' al seleccionar un archivo
    }
  }

  createArticle(): void {
    if (this.articleForm.valid) {
      const formData = new FormData();
      formData.append('title', this.articleForm.get('title')?.value);
      formData.append('text', this.articleForm.get('text')?.value);
      formData.append('tags', this.articleForm.get('tags')?.value);
      if (this.photo) {
        formData.append('photo', this.photo);
      }
      // Agregar otros campos según tu interfaz

      this.blogService.createArticle(this.articleForm.value).subscribe(
        (response) => {
          Swal.fire('Éxito', 'Artículo creado con éxito', 'success');
          this.router.navigate(['/dashboard/blog']); // Reemplaza con la ruta real
        },
        (error) => {
          Swal.fire(
            'Error',
            'Error al crear el artículo: ' + error.message,
            'error'
          );
        }
      );
    } else {
      Swal.fire(
        'Error',
        'Por favor, complete el formulario correctamente',
        'error'
      );
    }
  }
}
