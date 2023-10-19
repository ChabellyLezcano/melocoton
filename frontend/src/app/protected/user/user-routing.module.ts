import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUserComponent } from './pages/dashboard-user/dashboard-user.component';
import { ValidarTokenGuard } from 'src/app/guards/validarToken.guard';
import { UserGuard } from 'src/app/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardUserComponent},
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
