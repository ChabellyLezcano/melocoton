import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/authInterface';
import { UserDataService } from 'src/app/auth/service/user-data.service';
import { Game } from 'src/app/protected/interfaces/gameInterface';
import { RecommendationResponse } from 'src/app/protected/interfaces/recommendationResponse';
import { RecommendationService } from 'src/app/protected/services/recommendation.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
})
export class RecommendationComponent implements OnInit {
  user: User | null = null;
  recommendedGames: Game[] = [];

  constructor(
    private recommendationService: RecommendationService,
    private userDataService: UserDataService,
    private router: Router
  ) {
    this.userDataService.userData$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.getRecommendedGamesByUserId();
  }

  generateRecommendedGames() {
    this.recommendationService
      .generateRecommendedGames()
      .subscribe((response) => {
        console.log(response);
        if (response.ok) {
          this.recommendedGames = response.recommendedGames;
          this.getRecommendedGamesByUserId();

          // Manejar los juegos recomendados, por ejemplo, mostrarlos en la vista.
        } else {
          // Manejar el caso en que la solicitud no fue exitosa
        }
      });
  }

  // Ejemplo de cómo utilizar el servicio para obtener juegos recomendados por usuario
  getRecommendedGamesByUserId() {
    this.recommendationService
      .getRecommendedGamesByUserId()
      .subscribe((response: RecommendationResponse) => {
        if (response.ok) {
          this.recommendedGames = response.recommendedGames;
          // Manejar los juegos recomendados, por ejemplo, mostrarlos en la vista.
        } else {
          // Manejar el caso en que la solicitud no fue exitosa
        }
      });
  }

  onVerClick(gameId: string) {
    this.router.navigate(['/dashboard/game', gameId]);
  }
}
