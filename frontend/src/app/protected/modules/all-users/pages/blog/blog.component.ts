import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../../services/blog.service';
import { Article } from 'src/app/protected/interfaces/blogInterface';
import { UserDataService } from 'src/app/auth/service/user-data.service';
import { User } from 'src/app/auth/interfaces/authInterface';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  providers: [DatePipe],
})
export class BlogComponent implements OnInit {
  articles: Article[] = [];
  user: User | null = null;
  isAdmin: boolean = false;
  showOptions!: boolean; // Define options as an array

  constructor(
    private blogService: BlogService,
    private router: Router,
    private userDataService: UserDataService
  ) {
    this.userDataService.userData$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (user.role === 'Admin') {
          this.isAdmin = true;
        }
      }
    });



  }
  toggleOptions(article: Article) {
    // Cambiar la propiedad showOptions del artículo para mostrar/ocultar el menú de opciones
    this.showOptions = !this.showOptions;
  }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.blogService.getArticles().subscribe(
      (response) => {
        this.articles = response.articles;

        // Ordenar los artículos por fecha, más reciente primero
        this.articles.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  deleteArticle(id: string) {
    // Mostrar un modal de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el artículo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación, llamar al servicio
        this.blogService.deleteArticle(id).subscribe(
          (response) => {
            // Eliminación exitosa, puedes actualizar la lista de artículos si es necesario.
            this.getArticles();

            // Mostrar un modal de éxito
            Swal.fire(
              'Eliminado',
              'El artículo ha sido eliminado correctamente.',
              'success'
            );
          },
          (error) => {
            console.error('Error deleting article:', error);

            // Mostrar un modal de error
            Swal.fire('Error', 'No se pudo eliminar el artículo.', 'error');
          }
        );
      }
    });
  }

  onVerClick(articleId: string) {
    this.router.navigate(['/dashboard/article', articleId]);
  }

  onAddClick() {
    this.router.navigate(['/admin/add-article']);
  }

  onAddPhotoClick(articleId: string) {
    this.router.navigate(['/admin/upload-article-photo', articleId]);
  }

  onEditClick(articleId: string) {
    this.router.navigate(['/edit-article', articleId]);
  }
  

 

}
