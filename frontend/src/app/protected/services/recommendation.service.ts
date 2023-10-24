import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecommendationResponse } from '../interfaces/recommendationResponse';
import { Game } from '../interfaces/gameInterface';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Generar juegos recomendados
  generateRecommendedGames(): Observable<RecommendationResponse> {
    const url = `${this.baseUrl}/recommendation/generate-recommended-games`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.post<RecommendationResponse>(url, null, { headers });
  }

  // Obtener juegos recomendados por usuario
  getRecommendedGamesByUserId(): Observable<RecommendationResponse> {
    const url = `${this.baseUrl}/recommendation/get-recommended-games`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<RecommendationResponse>(url, { headers });
  }

}
