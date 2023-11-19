import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Listar juegos favoritos del usuario
  listFavorites(): Observable<any> {
    const url = `${this.baseUrl}/favorite/list-favorites`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.get(url, { headers });
  }

  // Marcar juego como favorito
  markFavorite(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/favorite/add-favorite/${gameId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.post(url, null, { headers });
  }

  // Desmarcar juego como favorito
  unmarkFavorite(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/favorite/unfavorite/${gameId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.delete(url, { headers });
  }
}
