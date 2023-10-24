import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
})
export class ListUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.listUsers();
  }

  listUsers() {
    this.userService.listUsers().subscribe(
      (response: any) => {
        this.users = response.users;
      },
      (error) => {
        console.error('Error al listar usuarios:', error);
      }
    );
  }

  changeToAdmin(userId: string) {
    Swal.fire({
      title: 'Confirmar acción',
      text: '¿Está seguro de cambiar el rol a Admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeToAdmin(userId).subscribe(
          (response) => {
            this.listUsers();
            Swal.fire('Éxito', response.msg, 'success');
          },
          (error) => {
            console.error('Error al cambiar el rol a Admin:', error);
            Swal.fire(
              'Error',
              'Hubo un error al cambiar el rol a Admin',
              'error'
            );
          }
        );
      }
    });
  }

  changeToCurrent(userId: string) {
    Swal.fire({
      title: 'Confirmar acción',
      text: '¿Está seguro de cambiar el rol a Current?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeToCurrent(userId).subscribe(
          (response: any) => {
            this.listUsers();
            Swal.fire('Éxito', response.msg, 'success');
          },
          (error) => {
            console.error('Error al cambiar el rol a Current:', error);
            Swal.fire(
              'Error',
              'Hubo un error al cambiar el rol a Current',
              'error'
            );
          }
        );
      }
    });
  }

  changeAccountStatusToBlocked(userId: string) {
    Swal.fire({
      title: 'Confirmar acción',
      text: '¿Está seguro de bloquear la cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeAccountStatusToBlocked(userId).subscribe(
          (response: any) => {
            this.listUsers();
            Swal.fire('Éxito', response.msg, 'success');
          },
          (error) => {
            console.error('Error al bloquear la cuenta:', error);
            Swal.fire('Error', 'Hubo un error al bloquear la cuenta', 'error');
          }
        );
      }
    });
  }

  changeAccountStatusToActive(userId: string) {
    Swal.fire({
      title: 'Confirmar acción',
      text: '¿Está seguro de desbloquear la cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeAccountStatusToActive(userId).subscribe(
          (response: any) => {
            // Realiza alguna acción después de desbloquear la cuenta (si es necesario)
            this.listUsers();
            Swal.fire('Éxito', response.msg, 'success');
          },
          (error) => {
            console.error('Error al desbloquear la cuenta:', error);
            Swal.fire(
              'Error',
              'Hubo un error al desbloquear la cuenta',
              'error'
            );
          }
        );
      }
    });
  }
}
