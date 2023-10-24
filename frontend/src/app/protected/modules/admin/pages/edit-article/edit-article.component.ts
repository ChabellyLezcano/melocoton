import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from 'src/app/protected/services/blog.service';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-article.component.html',
})
export class EditArticleComponent implements OnInit {
  articleId: string;
  editArticleForm: FormGroup;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.articleId = this.route.snapshot.params['id'];

    // Inicializa el FormGroup y define los campos del formulario
    this.editArticleForm = this.fb.group({
      title: ['Taylor Swift', Validators.required],
      text: ['El Eras Tour está arrasando', Validators.required],
      tags: ['taylorswift, erastour', Validators.required],
    });
  }

  ngOnInit() {
    this.loadArticleData();
  }

  loadArticleData() {
    this.blogService
      .getArticleById(this.articleId)
      .subscribe((response) => {
        console.log(response)
        if (response.ok) {
          const articleData = response.article;

          // Actualiza los campos del formulario con los datos cargados
          this.editArticleForm.patchValue({
            title: articleData.title,
            text: articleData.text,
           tags: articleData.tags
          });
        }
      });
  }

  updateArticle() {
    const formData = new FormData();

    // Accede a las propiedades del formulario de manera segura utilizando ?.
    formData.append('title', this.editArticleForm?.get('title')?.value || '');
    formData.append(
      'description',
      this.editArticleForm?.get('description')?.value || ''
    );
    formData.append('status', this.editArticleForm?.get('status')?.value || '');
    formData.append('rules', this.editArticleForm?.get('rules')?.value || '');
    formData.append(
      'objective',
      this.editArticleForm?.get('objective')?.value || ''
    );

    // Divide las etiquetas en elementos individuales
    const tagsValue = this.editArticleForm.get('tags')?.value;
    const tagsArray =
      typeof tagsValue === 'string'
        ? tagsValue.split(',').map((tag) => tag.trim())
        : [];

    // Agrega cada etiqueta como un elemento individual en FormData
    tagsArray.forEach((tag) => {
      formData.append('tags[]', tag);
    });

    // Agrega más campos al formData según tus necesidades

    this.blogService.updateArticle(this.articleId, this.editArticleForm.value).subscribe(
      (response) => {
        console.log(response)
        if (response.ok) {
          Swal.fire(
            'Éxito',
            'El juego se ha actualizado correctamente',
            'success'
          );
          this.router.navigate(['/dashboard/article', this.articleId]);
        }
      },
      (error) => {
        Swal.fire(
          'Error',
          'Ha ocurrido un error al actualizar el juego',
          'error'
        );
      }
    );
  }

  cancelUpdate() {
    this.router.navigate(['/dashboard/blog']);
  }

}
