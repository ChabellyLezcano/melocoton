import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './pages/dashboard/dashboard.component';
import { InfoGameComponent } from './pages/info-game/info-game.component';

const routes: Routes = [
  { path: '', component: DashboardAdminComponent },
  { path: 'game/:id', component: InfoGameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllUsersRoutingModule { }
