import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllUsersRoutingModule } from './all-users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogComponent } from './pages/blog/blog.component';
import { ArticleInfoComponent } from './pages/article-info/article-info.component';

@NgModule({
  declarations: [
    BlogComponent,
    ArticleInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AllUsersRoutingModule
  ]
})
export class AllUsersModule { }
