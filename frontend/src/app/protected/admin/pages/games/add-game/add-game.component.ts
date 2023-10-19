import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../../services/games.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
})
export class AddGameComponent {
  gameForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameForm = this.fb.group({
      title: ['¿Quien es Quien?', Validators.required],
      description: ['Adivina', Validators.required],
      tags: ['2-jugadores', Validators.required],
      reglas: ['ninguna', Validators.required],
      objective: ['Ganar', Validators.required],
    });
  }

  createGame(): void {
    if (this.gameForm.valid) {
      const formData = new FormData();
      const photoInput = this.gameForm.get('photo');

      if (photoInput && photoInput.value) {
        const file: File = photoInput.value;
        formData.append('photo', file, file.name);
      }

      formData.append('title', this.gameForm.get('title')?.value);
      formData.append('description', this.gameForm.get('description')?.value);
      formData.append('tags', this.gameForm.get('tags')?.value);
      formData.append('reglas', this.gameForm.get('reglas')?.value);
      formData.append('objective', this.gameForm.get('objective')?.value);

      this.gameService.createGame(this.gameForm.value).subscribe(
        (response) => {
          Swal.fire('Éxito', 'Juego creado con éxito', 'success');
          this.router.navigate(['/dashboard-admin']);
          console.log(this.gameForm);
        },
        (error) => {
          Swal.fire(
            'Error',
            'Error al crear el juego: ' + error.message,
            'error'
          );
        }
      );
    } else {
      Swal.fire(
        'Error',
        'Por favor, complete el formulario correctamente',
        'error'
      );
    }
  }
}
