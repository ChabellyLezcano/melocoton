import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Review, ReviewResponse } from '../interfaces/reviewInterface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });
  }

  // Crear una nueva reseña
  createReview(gameId:string, review: Review
  ): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/create-review/${gameId}`;
    const headers = this.getHeaders();

 

    return this.http.post<ReviewResponse>(url, review, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Editar una reseña existente
  editReview(
    reviewId: string,
    title: string,
    description: string,
    rating: number
  ): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/edit-review/${reviewId}`;
    const headers = this.getHeaders();

    const requestBody = {
      title,
      description,
      rating,
    };

    return this.http.put<ReviewResponse>(url, requestBody, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Eliminar una reseña existente
  deleteReview(reviewId: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/delete-review/${reviewId}`;
    const headers = this.getHeaders();

    return this.http.delete<ReviewResponse>(url, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Obtener todas las reseñas de un juego específico
  getGameReviews(gameId: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/game-reviews/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get<ReviewResponse>(url, { headers });
  }

  // Obtener la calificación promedio de reseñas para un juego específico
  getAverageRatingForGame(gameId: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/average-rating-reviews/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get<ReviewResponse>(url, { headers });
  }
}
