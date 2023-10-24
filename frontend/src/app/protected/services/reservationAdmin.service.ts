import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Game, GameResponse } from '../interfaces/gameInterface';
import { ReservationResponse } from '../interfaces/reservationInterface';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todas las reservaciones
  getAdminReservations(): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationAdmin/reservations`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.get<ReservationResponse>(url, { headers });
  }

  // Get reservations by status
  getReservationsByStatus(status: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationAdmin/reservations-by-status/${status}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    return this.http.get<ReservationResponse>(url, { headers });
  }

  // Aceptar una reservación
  acceptReservation(
    reservationId: string,
    expirationDate: Date
  ): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationAdmin/accept-reservation/${reservationId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    const body = { expirationDate };

    return this.http.post<ReservationResponse>(url, body, { headers });
  }

  // Rechazar una reservación
  rejectReservation(
    reservationId: string,
    rejectionReason: string
  ): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationAdmin/reject-reservation/${reservationId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    const body = { rejectionReason };

    return this.http.post<ReservationResponse>(url, body, { headers });
  }

  markAsPickedUp(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationAdmin/mark-as-picked-up-reservation/${reservationId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.post<ReservationResponse>(url, null, { headers });
  }

  markAsCompleted(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservationAdmin/mark-as-completed-reservation/${reservationId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.post<ReservationResponse>(url, null, { headers });
  }
}
