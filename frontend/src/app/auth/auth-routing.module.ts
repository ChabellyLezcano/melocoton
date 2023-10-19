import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'confirm-account/:token', component: ConfirmAccountComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
