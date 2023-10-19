import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceTsService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  visible = false; // Inicialmente, el p-dialog está oculto
  registerForm: FormGroup;

  registroResponse: any; // Variable para almacenar la respuesta JSON

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceTsService
  ) {
    this.registerForm = this.fb.group({
      username: ["chabe", [Validators.required]],
      email: ['chabelly370@gmail.com', [Validators.required, Validators.email]],
      password: ['Hola1234', [Validators.required, Validators.minLength(8)]],
      validatePassword: ['Hola1234', [Validators.required, Validators.minLength(8)]],
      role: ['Currrent', [Validators.required]],
    });
  }


  registro() {
    const { username, role, email, password, validatePassword } = this.registerForm.value;
  
    console.log(this.registerForm.value)
    // Verificar si validatePassword es igual a password
    if (validatePassword !== password) {
      // Mostrar un mensaje de error con SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return; // Salir de la función sin hacer la solicitud de registro
    }
  
    this.authService.registro(username, role, email, password, validatePassword).subscribe(
      (response) => {
        console.log(response)
        if (response === true) {
          // Registro exitoso
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'Tu registro se ha completado con éxito.',
        });
        } else {
          // Muestra un mensaje de error con SweetAlert utilizando response.msg
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response || 'Ha ocurrido un error en el registro. Por favor, intenta de nuevo más tarde.',
          });
        }
      },
      (error) => {
        // Error en la solicitud
        console.error(error); // Puedes agregar registro de error a la consola
        Swal.fire({
          icon: 'error',
          title: 'Error de Solicitud',
          text: 'Ha ocurrido un error en la solicitud. Por favor, intenta de nuevo más tarde.',
        });
      }
    );
  }
} 