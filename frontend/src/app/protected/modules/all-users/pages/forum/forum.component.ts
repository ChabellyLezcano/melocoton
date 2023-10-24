import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../../../services/message.service';
import {
  MessageResponse,
  Message,
} from '../../../../interfaces/messageInterface';
import Swal from 'sweetalert2';
import { UserDataService } from 'src/app/auth/service/user-data.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
})
export class ForumComponent implements OnInit {
  userId!: string;
  newMessageText: string = '';
  messages: Message[] = [];
  editedMessageText: string = '';
  orderedMeesages: Message[] = [];
  messageStates: { [key: string]: boolean } = {}; // Objeto para rastrear el estado de cada mensaje
  currentDate: string | null = null;
  isDialogOpen = false;
  isAdmin = false;
  // Dentro de tu componente ForumComponent
  messageIdBeingEdited: string = ''; // Declaración de la propiedad

  constructor(
    private messageService: MessageService,
    private userDataService: UserDataService
  ) {
    this.userDataService.userData$.subscribe((user) => {
      if (user) {
        this.userId = user._id;
        if (user.role === 'Admin') {
          this.isAdmin = true;
        }
      }
    });
  }

  ngOnInit() {
    this.getAllMessages();
  }

  closeMenu(messageId: string) {
    // Cierra el menú aquí, por ejemplo, establece isMessageOpen en false para el mensaje específico.
    this.messageStates[messageId] = false;
  }

  // Función para abrir el diálogo de edición con el messageId
  openEditDialog(messageId: string) {
    this.messageIdBeingEdited = messageId;
    this.isDialogOpen = true;
    // También puedes cargar el texto actual del mensaje si lo necesitas
    this.editedMessageText = this.getMessageTextById(messageId);
  }

  // Función para obtener el texto de un mensaje por su ID
  getMessageTextById(messageId: string): string {
    const message = this.messages.find((msg) => msg._id === messageId);
    return message ? message.text : '';
  }

  // Función para guardar los cambios al hacer clic en "Guardar"
  saveEditedMessage() {
    this.editMessage(this.messageIdBeingEdited, this.editedMessageText);
    this.closeEditDialog();
  }

  closeEditDialog() {
    this.isDialogOpen = false;
  }

  toggleMessageState(messageId: string) {
    // Cambia el estado del mensaje con el ID dado
    this.messageStates[messageId] = !this.messageStates[messageId];
  }

  isMessageOpen(messageId: string): boolean {
    // Verifica si el mensaje con el ID dado está abierto
    return this.messageStates[messageId] || false;
  }

  createNewMessage(text: string) {
    this.messageService.createMessage(text).subscribe(
      (response: MessageResponse) => {
        if (response.ok) {
          this.newMessageText = '';
          this.getAllMessages();
        } else {
          console.error('Error al crear el mensaje:', response.msg);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  getAllMessages() {
    this.messageService.getAllMessages().subscribe(
      (response: MessageResponse) => {
        if (response.ok) {
          this.messages = response.messages;
          this.orderedMeesages = this.messages.reverse();
        } else {
          console.error('Error al obtener mensajes:', response.msg);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  deleteMessage(messageId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar este mensaje?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.messageService.deleteMessage(messageId).subscribe(
          (response: MessageResponse) => {
            if (response && response.ok) {
              Swal.fire(
                'Eliminado',
                'El mensaje ha sido eliminado con éxito',
                'success'
              );

              // Eliminar el mensaje de la lista después de la eliminación
              this.getAllMessages();
            } else {
              Swal.fire(
                'Error',
                'Hubo un error al eliminar el mensaje',
                'error'
              );
            }
          },
          (error) => {
            Swal.fire('Error', 'Hubo un error en la solicitud', 'error');
          }
        );
      }
    });
  }

  editMessage(messageId: string, newText: string) {
    this.messageService.editMessage(messageId, newText).subscribe(
      (response: MessageResponse) => {
        if (response.ok) {
          // Busca el mensaje editado en la lista actual y actualízalo
          const editedMessage = this.messages.find(
            (message) => message._id === messageId
          );
          if (editedMessage) {
            editedMessage.text = newText;
          }
          this.closeMenu(messageId);
          console.log('Mensaje editado con éxito:', response.msg);
        } else {
          console.error('Error al editar el mensaje:', response.msg);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error.error);
      }
    );
  }
}
