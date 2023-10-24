import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGameComponent } from './pages/games/add-game/add-game.component';
import { UploadPhotoGameComponent } from './pages/games/upload-photo-game/upload-photo-game.component';
import { EditGameComponent } from './pages/games/edit-game/edit-game.component';
import { AllReservetionsHistoryComponent } from './pages/history/all-reservetions-history/all-reservetions-history.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { AddArticleComponent } from './pages/add-article/add-article.component';
import { UploadPhotoArticleComponent } from './pages/upload-photo-article/upload-photo-article.component';
import { EditArticleComponent } from './pages/edit-article/edit-article.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'add-game', component: AddGameComponent },
      { path: 'upload-game-photo/:id', component:UploadPhotoGameComponent },
      { path: 'edit-game/:id', component:EditGameComponent },
      { path: 'all-reservations-admin', component:AllReservetionsHistoryComponent },
      { path: 'list-users', component:ListUsersComponent },
      { path: 'add-article', component: AddArticleComponent },
      { path: 'upload-article-photo/:id', component:UploadPhotoArticleComponent },
      { path: 'edit-article/:id', component:EditArticleComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
