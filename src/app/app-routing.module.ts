import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './bartabs/tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './bartabs/tabs/tabs.module#TabsPageModule' },
  { path: 'bluetooth-connect', loadChildren: './bluetooth-connect/bluetooth-connect.module#BluetoothConnectPageModule' },
  { path: 'learning-sensor-calib', loadChildren: './learning/sensor-calibration/sensor-calibration.module#SensorCalibrationPageModule' },
  { path: 'learning-motors-calib', loadChildren: './learning/motors-calibration/motors-calibration.module#MotorsCalibrationPageModule' },
  { path: 'learning-buttons-usage', loadChildren: './learning/buttons-usage/buttons-usage.module#ButtonsUsagePageModule' },
  { path: 'learning-user-guide', loadChildren: './learning/user-guide/user-guide.module#UserGuidePageModule' },
  { path: 'learning-setup-hand', loadChildren: './learning/setup-hand/setup-hand.module#SetupHandPageModule' },
  { path: 'my-hand-infos', loadChildren: './my-hand/infos/infos.module#InfosPageModule' },
  { path: 'my-hand-sensor', loadChildren: './my-hand/sensor/sensor.module#SensorPageModule' },
  { path: 'my-hand-motors', loadChildren: './my-hand/motors/motors.module#MotorsPageModule' },
  { path: 'my-hand-motors-calib', loadChildren: './my-hand/motors-calib/motors-calib.module#MotorsCalibPageModule' },
  { path: 'my-hand-sensor-calib', loadChildren: './my-hand/sensor-calib/sensor-calib.module#SensorCalibPageModule' },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
