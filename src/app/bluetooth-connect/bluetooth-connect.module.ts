import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BluetoothConnectPage } from './bluetooth-connect.page';

const routes: Routes = [
  {
    path: '',
    component: BluetoothConnectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BluetoothConnectPage]
})
export class BluetoothConnectPageModule {}
