import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllUsersRoutingModule } from './all-users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    SharedModule,
    AllUsersRoutingModule
  ]
})
export class AllUsersModule { }
