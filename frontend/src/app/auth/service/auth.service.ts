import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { AuthResponse, User } from '../interfaces/authInterface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceTsService {
  private _user!: User;
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient, private router: Router) {}

  private baseUrl: string = environment.baseUrl;

  registro(
    username: string,
    role: string,
    email: string,
    password: string,
    validatePassword: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { username, email, password, role, validatePassword };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap(({ ok, token }) => {
        if (ok) {
          localStorage.setItem('token', token!);
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  login(email: string, password: string) {
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok === true) {
          localStorage.setItem('token', resp.token!);
          this._user = {
            ...this._user,
            email: resp.email!,
            username: resp.username!,
            _id: resp._id!,
            role: resp.role!,
            photo: resp.photo!
          };

          if (this._user.role === 'Admin') {
            this.router.navigate(['/dashboard-admin']);
          } else {
            this.router.navigate(['/dashboard-user']);
          }
        }
      }),

      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  validateToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        localStorage.setItem('token', resp.token!);
        this._user = {
          ...this._user,
          email: resp.email!,
          username: resp.username!,
          _id: resp._id!,
          role: resp.role!,
          photo: resp.photo!
        };
        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  confirmarCuenta(token: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/auth/confirm-account/${token}`; // Ajusta la ruta a la que utiliza tu backend

    return this.http.get<AuthResponse>(url);
  }

  forgotPassword(email: string): Observable<{ ok: boolean; message: string }> {
    const url = `${this.baseUrl}/auth/forgot-password`; // Ajusta la ruta a tu backend
    const body = { email };

    return this.http.post<{ ok: boolean; message: string }>(url, body);
  }

  checkToken(token: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/auth/check-token/${token}`; // Ajusta la ruta a tu backend

    return this.http.get<AuthResponse>(url);
  }

  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    const url = `${this.baseUrl}/auth/reset-password/${token}`; // Ajusta la ruta a tu backend
    const body = { newPassword };

    return this.http.post<AuthResponse>(url, body).pipe(
      map((response) => {
        if (response.ok) {
          return { ok: true, message: response.msg };
        } else {
          return {
            ok: false,
            message: response.msg || 'Error al actualizar la contraseña',
          };
        }
      }),
      catchError((err) =>
        of({ ok: false, message: 'Error al actualizar la contraseña' })
      )
    );
  }

  isUserAdmin(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/user-is-admin`; // Ajusta la ruta al endpoint correspondiente en tu backend

    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => resp.ok),
      catchError((err) => of(false))
    );
  }

  logout() {
    localStorage.clear();
  }
}
