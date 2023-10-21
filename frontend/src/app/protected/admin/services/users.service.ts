import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from 'src/app/auth/interfaces/authInterface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  listUsers(): Observable<AuthResponse> {
    const url = `${this.baseUrl}/users/list-users`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.get<AuthResponse>(url, { headers });
  }

  changeToAdmin(userId: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/users/change-to-admin/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post<AuthResponse>(url, { headers });
  }

  changeToCurrent(userId: string): Observable<any> {
    const url = `${this.baseUrl}/users/change-to-current/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post(url, null, { headers });
  }

  changeAccountStatusToBlocked(userId: string): Observable<any> {
    const url = `${this.baseUrl}/users/change-account-status-to-blocked/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post(url, null, { headers });
  }

  changeAccountStatusToActive(userId: string): Observable<any> {
    const url = `${this.baseUrl}/users/change-account-status-to-active/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post(url, null, { headers });
  }
}
