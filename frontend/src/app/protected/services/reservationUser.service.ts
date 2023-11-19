import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReservationResponse } from '../interfaces/reservationInterface';

@Injectable({
  providedIn: 'root',
})
export class ReservationUserService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Crear una nueva reservación
  createReservation(gameId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationUser/add-reservation/${gameId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.post<ReservationResponse>(url, null, { headers });
  }

  // Obtener el historial de reservaciones de un usuario
  getUserReservationHistory(): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationUser/reservations`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') ?? ''
    );
    return this.http.get<ReservationResponse>(url, { headers });
  }

  // Cancelar una reservación por su ID
  cancelReservation(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationUser/cancel-reservation/${reservationId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.post<ReservationResponse>(url, null, { headers });
  }
}
