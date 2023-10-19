import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { InfoGameComponent } from './pages/games/info-game/info-game.component';
import { AddGameComponent } from './pages/games/add-game/add-game.component';
import { UploadPhotoGameComponent } from './pages/upload-photo-game/upload-photo-game.component';
import { EditGameComponent } from './pages/games/edit-game/edit-game.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardAdminComponent },
      { path: 'game/:id', component: InfoGameComponent },
      { path: 'add-game', component: AddGameComponent },
      { path: 'upload-game-photo/:id', component:UploadPhotoGameComponent },
      { path: 'edit-game/:id', component:EditGameComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
