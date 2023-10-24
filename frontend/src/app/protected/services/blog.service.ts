import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Article, BlogResponse } from '../interfaces/blogInterface';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los artículos
  getArticles(): Observable<BlogResponse> {
    const url = `${this.baseUrl}/blog/articles`;

    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<BlogResponse>(url, { headers });
  }

  // Obtener un artículo por ID
  getArticleById(id: string): Observable<BlogResponse> {
    const url = `${this.baseUrl}/blog/get-article/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.get<BlogResponse>(url, { headers });
  }

  // Crear un nuevo artículo
  createArticle(article: Article): Observable<BlogResponse> {
    const url = `${this.baseUrl}/blog/add-article`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.post<BlogResponse>(url, article, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Actualizar un artículo existente
  updateArticle(id: string, article: Article): Observable<BlogResponse> {
    const url = `${this.baseUrl}/blog/edit-article/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.put<BlogResponse>(url, article, { headers });
  }

  // Eliminar un artículo por ID
  deleteArticle(id: string): Observable<BlogResponse> {
    const url = `${this.baseUrl}/blog/delete-article/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.delete<BlogResponse>(url, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  // Actualizar la foto de un juego de mesa
  updateArticlePhoto(id: string, photo: File): Observable<BlogResponse> {
    const url = `${this.baseUrl}/blog/upload-article-photo/${id}`;
    const formData = new FormData();
    formData.append('photo', photo);

    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.put<BlogResponse>(url, formData, { headers });
  }

    // Dar like a un artículo
    likeArticle(id: string): Observable<BlogResponse> {
      const url = `${this.baseUrl}/blog/like-article/${id}`;
      const headers = new HttpHeaders().set(
        'token',
        localStorage.getItem('token') || ''
      );
  
      return this.http.put<BlogResponse>(url, null, { headers }).pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
    }
  
    // Quitar like a un artículo
    unlikeArticle(id: string): Observable<BlogResponse> {
      const url = `${this.baseUrl}/blog/unlike-article/${id}`;
      const headers = new HttpHeaders().set(
        'token',
        localStorage.getItem('token') || ''
      );
  
      return this.http.put<BlogResponse>(url, { headers }).pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
    }
  
}
