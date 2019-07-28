import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MotorsCalibPage } from './motors-calib.page';

const routes: Routes = [
  {
    path: '',
    component: MotorsCalibPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MotorsCalibPage]
})
export class MotorsCalibPageModule {}
