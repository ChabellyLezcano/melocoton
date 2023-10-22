import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/authInterface';
import { AuthServiceTsService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: any | undefined;
  isAdmin: boolean = false;

  constructor(private authService: AuthServiceTsService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserInfo().subscribe((response) => {
      if (response) {
        this.user = response.user;
        console.log(response)
        if (response.user.role === 'Admin') {
          this.isAdmin = true;
        }
      }
    });
  }

  redirectToDashboard() {
    if (this.isAdmin) {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.router.navigate(['/dashboard-user']);
    }
  }
}
