import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/authInterface';
import { AuthServiceTsService } from 'src/app/auth/service/auth.service';
import { GameService } from '../../services/games.service';
import { Game } from '../../interfaces/gameInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent implements OnInit {
  user: User | undefined;
  games: Game[] = [];
  totalRecords: number = 0; // Número total de registros
  rows: number = 20; // Cambiado a 20 juegos por página
  first: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gameService: GameService,
    private authService: AuthServiceTsService
  ) {}

  ngOnInit() {
    this.user = this.authService.user;
    console.log(this.user)
    this.getGames();
  }

  isGameUnavailable(game: any): boolean {
    return game.status === "No Disponible";
  }

  onPageChange(event: any) {
    this.first = event.first;
    // No es necesario actualizar "this.colums" ya que estamos usando "this.rows"
    this.getGames();
  }

  getGames() {
    // Llama a tu servicio de juegos y considera la paginación con this.first y this.rows
    const page = Math.floor(this.first / this.rows) + 1; // Calcula el número de página
    this.gameService.getGames(page, this.rows).subscribe(
      (resp) => {
        this.games = resp.games;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
        });
      }
    );
  }

  onVerClick(gameId: string) {
    this.router.navigate(['/game', gameId]);

  }

  onAddGameClick() {
    this.router.navigate(['/add-game']);
  }
  
  
}
