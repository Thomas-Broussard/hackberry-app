import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './bartabs/tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'buttons-usage', loadChildren: './learning/buttons-usage/buttons-usage.module#ButtonsUsagePageModule' },
  { path: 'user-guide', loadChildren: './learning/user-guide/user-guide.module#UserGuidePageModule' },
  { path: 'assembly-guide', loadChildren: './learning/assembly-guide/assembly-guide.module#AssemblyGuidePageModule' },
  { path: 'bluetooth-connect', loadChildren: './bluetooth-connect/bluetooth-connect.module#BluetoothConnectPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
