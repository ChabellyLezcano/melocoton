import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { ListFavoritesComponent } from './pages/list-favorites/list-favorites.component';
import { ReservationsUserComponent } from './pages/reservations-user/reservations-user.component';
import { ReviewFormComponent } from './pages/review-form/review-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewFormEditComponent } from './pages/review-form-edit/review-form-edit.component';


@NgModule({
  declarations: [
    RecommendationComponent,
    ListFavoritesComponent,
    ReservationsUserComponent,
    ReviewFormComponent,
    ReviewFormEditComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
