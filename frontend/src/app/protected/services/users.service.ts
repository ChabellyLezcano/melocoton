import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from 'src/app/auth/interfaces/authInterface';
import { UserResponse } from '../interfaces/userInterface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  listUsers(): Observable<UserResponse> {
    const url = `${this.baseUrl}/user/list-users`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.get<UserResponse>(url, { headers });
  }

  changeToAdmin(userId: string): Observable<UserResponse> {
    const url = `${this.baseUrl}/user/change-to-admin/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post<UserResponse>(url, null, { headers });
  }

  changeToCurrent(userId: string): Observable<UserResponse> {
    const url = `${this.baseUrl}/user/change-to-current/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post<UserResponse>(url, null, { headers });
  }

  changeAccountStatusToBlocked(userId: string): Observable<UserResponse> {
    const url = `${this.baseUrl}/user/change-account-status-to-blocked/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post<UserResponse>(url, null, { headers });
  }



  changeAccountStatusToActive(userId: string): Observable<UserResponse> {
    const url = `${this.baseUrl}/user/change-account-status-to-active/${userId}`;
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    });

    return this.http.post<UserResponse>(url, null, { headers });
  }
}
