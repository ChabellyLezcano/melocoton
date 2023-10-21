import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html'
})
export class SidebarUserComponent {

  sidebarVisible = false;

  constructor(private router: Router){}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  logout() {
    // Borra el token del almacenamiento local
    localStorage.removeItem('token');

    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
  }

}
