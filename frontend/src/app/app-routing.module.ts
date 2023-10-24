import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from './guards/validarToken.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';


const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./protected/modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [ValidarTokenGuard, AdminGuard], 
    canLoad: [ValidarTokenGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./protected/modules/user/user.module').then(m => m.UserModule),
    canActivate: [ValidarTokenGuard, UserGuard], 
    canLoad: [ValidarTokenGuard],
  
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./protected/modules/all-users/all-users.module').then(m => m.AllUsersModule),
    canActivate: [ValidarTokenGuard],
    canLoad: [ValidarTokenGuard],
  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
