import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../prime-ng/primen-ng.module';
import { HeaderComponent } from './components/header/header.component';
import { SidebarAdminComponent } from './components/sidebar-admin/sidebar-admin.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { AppReservationsButtonsComponent } from './components/app-reservations-buttons/app-reservations-buttons.component';
import { ReservationItemComponent } from './components/reservation-item/reservation-item.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarAdminComponent,
    SidebarUserComponent,
    AppReservationsButtonsComponent,
    ReservationItemComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [ HeaderComponent, SidebarAdminComponent, AppReservationsButtonsComponent, ReservationItemComponent ]
})
export class SharedModule { }
