import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { InfoGameComponent } from './pages/games/info-game/info-game.component';
import { AddGameComponent } from './pages/games/add-game/add-game.component';
import { UploadPhotoGameComponent } from './pages/games/upload-photo-game/upload-photo-game.component';
import { EditGameComponent } from './pages/games/edit-game/edit-game.component';
import { AllReservetionsHistoryComponent } from './pages/history/all-reservetions-history/all-reservetions-history.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardAdminComponent },
      { path: 'game/:id', component: InfoGameComponent },
      { path: 'add-game', component: AddGameComponent },
      { path: 'upload-game-photo/:id', component:UploadPhotoGameComponent },
      { path: 'edit-game/:id', component:EditGameComponent },
      { path: 'all-reservations-admin', component:AllReservetionsHistoryComponent },
      { path: 'list-users', component:ListUsersComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
