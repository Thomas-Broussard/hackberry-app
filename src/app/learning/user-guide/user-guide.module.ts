import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserGuidePage } from './user-guide.page';
import {MatExpansionModule} from '@angular/material/expansion'; 


const routes: Routes = [
  {
    path: '',
    component: UserGuidePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatExpansionModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserGuidePage]
})
export class UserGuidePageModule {}
