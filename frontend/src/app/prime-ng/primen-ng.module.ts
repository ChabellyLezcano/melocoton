import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import {CarouselModule} from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [],
  imports: [
  ], 
  exports: [
    DialogModule,
    ButtonModule,
    SidebarModule,
    MenubarModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    PaginatorModule,
    CarouselModule,
    DropdownModule
  ]
})
export class PrimeNgModule { }
