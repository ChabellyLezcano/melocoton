import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './pages/dashboard/dashboard.component';
import { InfoGameComponent } from './pages/info-game/info-game.component';
import { ForumComponent } from './pages/forum/forum.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ArticleInfoComponent } from './pages/article-info/article-info.component';

const routes: Routes = [
  { path: '', component: DashboardAdminComponent },
  { path: 'game/:id', component: InfoGameComponent },
  { path: 'forum', component:ForumComponent },
  { path: 'blog', component:BlogComponent },
  { path: 'article/:id', component: ArticleInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllUsersRoutingModule { }
