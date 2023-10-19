import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceTsService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['chabelly370@gmail.com', [Validators.required, Validators.email]],
  });


  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceTsService
  ) {}

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword(email).subscribe(
        (response) => {
          if (response.ok) {
            // Mostrar Sweet Alert de éxito
            Swal.fire({
              icon: 'success',
              title: 'Correo Enviado',
              text: 'Se ha enviado un correo para recuperar tu contraseña.',
            });
          } else {
            // Mostrar Sweet Alert de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message,
            });
          }
        },
        (error) => {
          // Mostrar Sweet Alert de error en caso de una solicitud fallida
          Swal.fire({
            icon: 'error',
            title: 'Error de Solicitud',
            text: 'Ha ocurrido un error al solicitar el restablecimiento de contraseña.',
          });
        }
      );
    }
  }
}
