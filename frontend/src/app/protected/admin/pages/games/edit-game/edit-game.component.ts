import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../services/games.service';
import { GameResponse, Game } from '../../../interfaces/gameInterface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
})
export class EditGameComponent implements OnInit {
  gameId: string;
  editGameForm: FormGroup;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.gameId = this.route.snapshot.params['id'];

    // Inicializa el FormGroup y define los campos del formulario
    this.editGameForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
      tags: [''], // Puedes usar FormArray si necesitas una lista
      rules: [''], // Agrega el campo rules
      objective: [''], // Agrega el campo objective
      // Define otros campos del formulario según tus necesidades
    });
  }

  ngOnInit() {
    this.loadGameData();
  }

  loadGameData() {
    this.gameService.getGameById(this.gameId).subscribe((game: GameResponse) => {
      if (game.ok) {
        const gameData = game.game;

        // Actualiza los campos del formulario con los datos cargados
        this.editGameForm.patchValue({
          title: gameData.title,
          description: gameData.description,
          status: gameData.status,
          tags: gameData.tags,
          rules: gameData.rules, // Actualiza el campo rules
          objective: gameData.objective, // Actualiza el campo objective
          // Actualiza otros campos según sea necesario
        });
      }
    });
  }

  updateGame() {
    const formData = new FormData();
  
    // Accede a las propiedades del formulario de manera segura utilizando ?. 
    formData.append('title', this.editGameForm?.get('title')?.value || '');
    formData.append('description', this.editGameForm?.get('description')?.value || '');
    formData.append('status', this.editGameForm?.get('status')?.value || '');
    formData.append('rules', this.editGameForm?.get('rules')?.value || '');
    formData.append('objective', this.editGameForm?.get('objective')?.value || '');
    
// Divide las etiquetas en elementos individuales
const tagsValue = this.editGameForm.get('tags')?.value;
const tagsArray = (typeof tagsValue === 'string') ? tagsValue.split(',').map(tag => tag.trim()) : [];

// Agrega cada etiqueta como un elemento individual en FormData
tagsArray.forEach(tag => {
  formData.append('tags[]', tag);
});



    // Agrega más campos al formData según tus necesidades
  
    this.gameService.updateGame(this.gameId, this.editGameForm.value).subscribe(
      (response: GameResponse) => {
        if (response.ok) {
          Swal.fire('Éxito', 'El juego se ha actualizado correctamente', 'success');
          this.router.navigate(['/game', this.gameId]);
        } else {
          Swal.fire('Error', response.msg || 'Ha ocurrido un error al actualizar el juego', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'Ha ocurrido un error al actualizar el juego', 'error');
      }
    );
  }

  cancelUpdate(){
    this.router.navigate(['/game', this.gameId]);
  }
}
