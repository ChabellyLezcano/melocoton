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
    path: 'dashboard-admin',
    loadChildren: () => import('./protected/admin/admin.module').then(m => m.AdminModule),
    canActivate: [ValidarTokenGuard, AdminGuard], // Aplicadas a rutas principales
    canLoad: [ValidarTokenGuard],
  },
  {
    path: 'dashboard-user',
    loadChildren: () => import('./protected/user/user.module').then(m => m.UserModule),
    canActivate: [ValidarTokenGuard, UserGuard], // Aplicadas a rutas principales
    canLoad: [ValidarTokenGuard],
  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
