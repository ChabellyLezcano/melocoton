import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/authInterface';
import { AuthServiceTsService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html'
})
export class DashboardUserComponent implements OnInit {
  user: User | undefined;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthServiceTsService) { }

  ngOnInit() {
    // Accede al valor de this._user desde el servicio
    this.user = this.authService.user;
    
  }
}