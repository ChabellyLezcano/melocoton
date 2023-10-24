import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/authInterface';
import { AuthServiceTsService } from 'src/app/auth/service/auth.service';
import { UserDataService } from 'src/app/auth/service/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: User | null = null; // Cambia el tipo a User | null
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private authService: AuthServiceTsService // Inyecta el servicio AuthServiceTsService
  ) {}

  ngOnInit() {
    this.userDataService.userData$.subscribe((user) => {
      if (user) {
        this.user = user;
        if (user.role === 'Admin') {
          this.isAdmin = true;
        }
      }
    });
  }

  // Agrega una función para llamar a logout
  logout() {
    this.authService.logout();
  }

  redirectToDashboard() {
    
      this.router.navigate(['/dashboard']);
  }
}
