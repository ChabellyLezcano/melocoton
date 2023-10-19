import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceTsService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/authInterface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup = this.fb.group({
    email: ['prueba1.stingray@gmail.com', [Validators.required, Validators.email]],
    password: ['Hola1234', [Validators.required, Validators.minLength(8)]],
  });

  private _user: User | null = null; // Define la propiedad _usuario

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthServiceTsService) { }


  login() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (ok) => {
        if (ok === true) {
          console.log(ok);
        } else {
          Swal.fire('Error', ok, 'error');
        }
      }
    );
  }


  
}

