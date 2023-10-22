import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageResponse } from '../interfaces/messageInterface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

    private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createMessage(text: string): Observable<MessageResponse> {
    const url = `${this.baseUrl}/forum/create-message`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    const body = { text }; // Debes adaptar esto a la estructura requerida por tu backend.

    return this.http.post<MessageResponse>(url, body, { headers });
  }

  getAllMessages(): Observable<MessageResponse> {
    const url = `${this.baseUrl}/forum/get-messages`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<MessageResponse>(url, { headers });
  }

  // Eliminar un mensaje
  deleteMessage(messageId: string): Observable<MessageResponse> {
    const url = `${this.baseUrl}/forum/delete-message/${messageId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.delete<MessageResponse>(url, { headers });
  }
  

  editMessage(messageId: string, text: string): Observable<MessageResponse> {
    const url = `${this.baseUrl}/forum/edit-message/${messageId}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );
    const body = { text }; // Debes adaptar esto a la estructura requerida por tu backend.

    return this.http.put<MessageResponse>(url, body, { headers });
  }
}
