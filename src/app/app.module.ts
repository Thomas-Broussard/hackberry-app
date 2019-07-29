import { BluetoothInstructions } from './services/bluetooth-instructions.service';

// plugins
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';


import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Services
import { BluetoothService } from './services/bluetooth.service';
import { GeneralService } from './services/general.service';

// Pages

import { UserGuidePage } from './learning/user-guide/user-guide.page';
import { ButtonsUsagePage } from './learning/buttons-usage/buttons-usage.page';
import { AssemblyGuidePage } from './learning/assembly-guide/assembly-guide.page';
import { UserGuidePageModule } from './learning/user-guide/user-guide.module';
import { ButtonsUsagePageModule } from './learning/buttons-usage/buttons-usage.module';

import { BluetoothConnectPageModule } from './bluetooth-connect/bluetooth-connect.module';
import { BluetoothConnectPage } from './bluetooth-connect/bluetooth-connect.page';

import { SensorPage } from './my-hand/sensor/sensor.page';
import { MotorsPage } from './my-hand/motors/motors.page';
import { SensorPageModule } from './my-hand/sensor/sensor.module';
import { MotorsPageModule } from './my-hand/motors/motors.module';
import { InfosPage } from './my-hand/infos/infos.page';
import { InfosPageModule } from './my-hand/infos/infos.module';
import { PdfService } from './services/pdf/pdf.service';


@NgModule({
  declarations: [
    AppComponent,
    
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    // My Hand
    InfosPageModule,
    MotorsPageModule,
    SensorPageModule,

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

    // My Hand
    InfosPage,
    MotorsPage,
    SensorPage,
    
    // Learning
    AssemblyGuidePage,
    ButtonsUsagePage,
    UserGuidePage,

    // Home
    BluetoothConnectPage,
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BluetoothSerial,
    File,
    FileOpener,
    FileTransfer,
    DocumentViewer,

    // local services
    BluetoothService,
    BluetoothInstructions,
    GeneralService,
    PdfService,
  ]

})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}