import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from 'src/app/guards/validarToken.guard';
import { UserGuard } from 'src/app/guards/user.guard';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { ListFavoritesComponent } from './pages/list-favorites/list-favorites.component';
import { ReservationsUserComponent } from './pages/reservations-user/reservations-user.component';
import { ReviewFormComponent } from './pages/review-form/review-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'recommendation', component: RecommendationComponent},
      { path: 'list-favorites', component: ListFavoritesComponent},
      { path: 'reservation-user', component: ReservationsUserComponent},
      { path: 'review/:id', component:ReviewFormComponent},
    ],
    canActivate: [ ValidarTokenGuard, UserGuard ],
    canLoad: [ ValidarTokenGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
