import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from 'src/app/guards/validarToken.guard';
import { UserGuard } from 'src/app/guards/user.guard';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'recommendation', component: RecommendationComponent},
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
