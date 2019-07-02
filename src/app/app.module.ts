import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import {HttpClient, HttpClientModule} from '@angular/common/http';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Pages
import { HomePageModule } from './home/home.module';
import { HomePage } from './home/home.page';

import { UserGuidePage } from './learning/user-guide/user-guide.page';
import { ButtonsUsagePage } from './learning/buttons-usage/buttons-usage.page';
import { AssemblyGuidePage } from './learning/assembly-guide/assembly-guide.page';
import { UserGuidePageModule } from './learning/user-guide/user-guide.module';
import { ButtonsUsagePageModule } from './learning/buttons-usage/buttons-usage.module';
import { AssemblyGuidePageModule } from './learning/assembly-guide/assembly-guide.module';

import { BluetoothConnectPageModule } from './bluetooth-connect/bluetooth-connect.module';
import { BluetoothConnectPage } from './bluetooth-connect/bluetooth-connect.page';


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

    // Learning
    AssemblyGuidePageModule,
    ButtonsUsagePageModule,
    UserGuidePageModule,

    // Home
    BluetoothConnectPageModule,

    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),

    // Material
    BrowserAnimationsModule,
  ],

  bootstrap: [AppComponent],

  entryComponents: [
    HomePage,
    // Learning
    AssemblyGuidePage,
    ButtonsUsagePage,
    UserGuidePage,
    // Home
    BluetoothConnectPage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BluetoothSerial,
  ]

})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}