import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/interfaces/authInterface';
import { AuthServiceTsService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  user: User | undefined;
  isAdmin: boolean = false;

  constructor(private authService: AuthServiceTsService) {}

  ngOnInit() {
    this.user = this.authService.user;
    if (this.user && this.user.role === 'Admin') {
      this.isAdmin = true;
    }
  }
}
