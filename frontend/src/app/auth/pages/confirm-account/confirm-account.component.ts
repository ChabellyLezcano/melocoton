import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceTsService } from '../../service/auth.service'; // Asegúrate de importar el servicio de autenticación


@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html'
})
export class ConfirmAccountComponent implements OnInit {
  token?: string;
  confirmacionExitosa = false;
  isLoading = true;

  constructor(private route: ActivatedRoute, private authService: AuthServiceTsService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
  
      if (this.token) {
        this.authService.confirmarCuenta(this.token).subscribe(
          (response) => {
            if (response.ok) {
              // La cuenta se confirmó correctamente
              this.confirmacionExitosa = true;
            } else {
              // Hubo un problema al confirmar la cuenta
              this.confirmacionExitosa = false;
              console.error('Error al confirmar la cuenta');
            }
            this.isLoading = false; // Establecer isLoading como falso cuando se recibe la respuesta
          },
          (error) => {
            // Hubo un error en la solicitud al servidor
            console.error('Error de solicitud al confirmar la cuenta', error);
            this.confirmacionExitosa = false;
            this.isLoading = false; // Asegúrate de manejar errores y establecer isLoading como falso
          }
        );
      }
    });
  }
  
  onLoginClick() {
    // Redirigir a la ruta de inicio de sesión
    this.router.navigate(['/login']);
  }
  
}
