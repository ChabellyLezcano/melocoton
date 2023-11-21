import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardAdminComponent } from '../all-users/pages/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/primen-ng.module';
import { EditGameComponent } from './pages/games/edit-game/edit-game.component';
import { InfoGameComponent } from '../all-users/pages/info-game/info-game.component';
import { AddGameComponent } from './pages/games/add-game/add-game.component';
import { UploadPhotoGameComponent } from './pages/games/upload-photo-game/upload-photo-game.component';
import { AllReservetionsHistoryComponent } from './pages/history/all-reservetions-history/all-reservetions-history.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DashboardAdminComponent,
    EditGameComponent,
    InfoGameComponent,
    AddGameComponent,
    UploadPhotoGameComponent,
    AllReservetionsHistoryComponent,
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule

  ]
})
export class AdminModule { }
