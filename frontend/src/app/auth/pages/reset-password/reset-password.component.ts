import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceTsService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    validatePassword: ['', [Validators.required]],
  });

  token: string | null = null;
  tokenValid: boolean = false;
  isLoading: boolean = true; // Agrega la variable isLoading y establece su valor inicial en true

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceTsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el token de la URL
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        // Verificar el token al cargar la página
        this.authService.checkToken(this.token).subscribe(
          (response) => {
            if (response.ok) {
              // El token es válido
              this.tokenValid = true;
            } else {
              // El token no es válido
              this.tokenValid = false;
              Swal.fire({
                icon: 'error',
                title: 'Token no válido',
                text: 'El token proporcionado no es válido. Por favor, solicita un nuevo correo de restablecimiento de contraseña.',
              });
            }
            this.isLoading = false; // Establece isLoading como falso cuando se recibe la respuesta
          },
          (error) => {
            // Error al verificar el token
            this.tokenValid = false;
            Swal.fire({
              icon: 'error',
              title: 'Error de Solicitud',
              text: 'Ha ocurrido un error al verificar el token. Por favor, intenta de nuevo más tarde.',
            });
            this.isLoading = false; // Asegúrate de manejar errores y establecer isLoading como falso
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.tokenValid) {
      const newPassword = this.resetPasswordForm.value.newPassword;

      this.authService.resetPassword(this.token!, newPassword).subscribe(
        (response) => {
          if (response.ok) {
            // Mostrar Sweet Alert de éxito
            Swal.fire({
              icon: 'success',
              title: 'Contraseña Actualizada',
              text: response.msg,
            }).then(() => {
              // Redirigir al usuario a la página de inicio de sesión
              this.router.navigate(['/auth/login']);
            });
          } else {
            // Mostrar Sweet Alert de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.msg,
            });
          }
        },
        (error) => {
          // Mostrar Sweet Alert de error en caso de una solicitud fallida
          Swal.fire({
            icon: 'error',
            title: 'Error de Solicitud',
            text: 'Ha ocurrido un error al actualizar la contraseña. Por favor, intenta de nuevo más tarde.',
          });
        }
      );
    }
  }
}
