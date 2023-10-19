import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Game, GameResponse } from '../interfaces/gameResponse';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los juegos
  getGames(page: number, rows: number): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/games`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('rows', rows.toString());

    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<GameResponse>(url, { headers, params });
  }

  // Obtener un juego por ID
  getGameById(id: string): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/get-single-game/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.get<GameResponse>(url, { headers });
  }

  // Crear un nuevo juego
  createGame(game: Game): Observable<Game> {
    const url = `${this.baseUrl}/game/add-game`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.post<Game>(url, game, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Actualizar un juego existente
  updateGame(id: string, game: Game): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/edit-game/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.put<GameResponse>(url, game, { headers });
  }

  // Eliminar un juego por ID
  deleteGame(id: string): Observable<void> {
    const url = `${this.baseUrl}/game/delete-game/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.delete<void>(url, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // Actualizar la foto de un juego de mesa
  updateBoardGamePhoto(id: string, photo: File): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/upload-photo/${id}`;
    const formData = new FormData();
    formData.append('photo', photo);

    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.put<GameResponse>(url, formData, { headers });
  }
}
