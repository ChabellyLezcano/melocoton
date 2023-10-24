import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/protected/services/blog.service';
import { Article } from 'src/app/protected/interfaces/blogInterface';
import { DatePipe } from '@angular/common';
import { UserDataService } from 'src/app/auth/service/user-data.service';
import { User } from 'src/app/auth/interfaces/authInterface';

@Component({
  selector: 'app-article-info',
  templateUrl: './article-info.component.html',
  providers: [DatePipe],
})
export class ArticleInfoComponent implements OnInit {
  article: Article | undefined;
  articleId: string;
  hasLiked!: boolean;
  user: User | null = null; 

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private userDataService: UserDataService
  ) {
    this.articleId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    // Llamar al servicio para obtener el artículo por ID
    this.blogService.getArticleById(this.articleId).subscribe(
      (response) => {
        this.article = response.article; 
        this.hasLiked = this.article.likes.some(like => like.user === this.user?._id); // Reemplaza 'ID_DEL_USUARIO_ACTUAL'
      },
      (error) => {
        console.error('Error al obtener el artículo:', error);
      }
    );
  }

  toggleLike() {
    if (this.article) {
      if (this.hasLiked) {
        this.blogService.unlikeArticle(this.articleId).subscribe(
          (response) => {
            this.hasLiked = false;
            if (this.article && this.article.numLikes) {
              this.article.numLikes--; // Actualiza el conteo de likes
            }
          },
          (error) => {
            console.error('Error al quitar el like:', error);
          }
        );
      } else {
        this.blogService.likeArticle(this.articleId).subscribe(
          (response) => {
            this.hasLiked = true;
            if (this.article && this.article.numLikes) {
              this.article.numLikes++; // Actualiza el conteo de likes
            }
          },
          (error) => {
            console.error('Error al dar like:', error);
          }
        );
      }
    }
  }
  
  
  
}