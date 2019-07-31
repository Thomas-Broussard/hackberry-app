import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MotorsCalibrationPage } from './motors-calibration.page';

const routes: Routes = [
  {
    path: '',
    component: MotorsCalibrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MotorsCalibrationPage]
})
export class MotorsCalibrationPageModule {}
