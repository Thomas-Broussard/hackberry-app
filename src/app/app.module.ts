import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Pages
import { HomePageModule } from './home/home.module';
import { HomePage } from './home/home.page';

@NgModule({
  declarations: [
    AppComponent,
    //HomePage
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    HomePageModule,
  ],

  bootstrap: [AppComponent],

  entryComponents: [
    HomePage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]

})
export class AppModule {}
