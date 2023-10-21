import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html'
})
export class ListUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.listUsers();
  }

  listUsers() {
    this.userService.listUsers().subscribe(
      (data: any) => {
        this.users = data.users;
      },
      (error) => {
        console.error('Error al listar usuarios:', error);
      }
    );
  }
  changeToAdmin(userId: string) {
    this.userService.changeToAdmin(userId).subscribe(
      (data: any) => {
        // Realiza alguna acción después de cambiar a Admin (si es necesario)
        console.log('Rol cambiado a Admin:', data);
      },
      (error) => {
        console.error('Error al cambiar el rol a Admin:', error);
      }
    );
  }

  changeToCurrent(userId: string) {
    this.userService.changeToCurrent(userId).subscribe(
      (data: any) => {
        // Realiza alguna acción después de cambiar a Current (si es necesario)
        console.log('Rol cambiado a Current:', data);
      },
      (error) => {
        console.error('Error al cambiar el rol a Current:', error);
      }
    );
  }

  changeAccountStatusToBlocked(userId: string) {
    this.userService.changeAccountStatusToBlocked(userId).subscribe(
      (data: any) => {
        // Realiza alguna acción después de bloquear la cuenta (si es necesario)
        console.log('Usuario bloqueado:', data);
      },
      (error) => {
        console.error('Error al bloquear la cuenta:', error);
      }
    );
  }

  changeAccountStatusToActive(userId: string) {
    this.userService.changeAccountStatusToActive(userId).subscribe(
      (data: any) => {
        // Realiza alguna acción después de desbloquear la cuenta (si es necesario)
        console.log('Usuario desbloqueado:', data);
      },
      (error) => {
        console.error('Error al desbloquear la cuenta:', error);
      }
    );
  }

}
