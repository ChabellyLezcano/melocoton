import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceTsService } from '../auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthServiceTsService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.user; // Obtén el usuario desde tu servicio de autenticación

    // Verifica si el usuario tiene el rol "admin"
    if (user.role === 'Admin') {
      return true; // Permite la navegación
    }

    // Si el usuario no es un administrador, redirige a la página de inicio de sesión
    this.router.navigate(['/login']);
    return false;
  }
}
