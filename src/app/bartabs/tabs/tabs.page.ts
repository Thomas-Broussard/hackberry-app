import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy, AfterViewInit{

  constructor(private platform : Platform,
              private alertController : AlertController,
              public bluetooth : BluetoothService,
              public navCtrl: NavController,
              private gen : GeneralService,
              private router : Router) {}

  subscription : any ;
  currentTab : number = 0;
  maxTab : number = 3;

  ngOnInit() 
  { 
    this.gen.getLanguage().then();
    this.bluetooth.isConnected();
  }
  
  ngAfterViewInit() {
    let me = this;
    async function display(text){
      const alert = await me.alertController.create({
        header: text + ' ?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          }, {
            text: 'Yes',
            handler: () => {
              navigator['app'].exitApp();
            }
          }
        ]
      });
  
      await alert.present();
    }

    this.subscription = this.platform.backButton.subscribe(async () => {
      if (me.isHomePath()) 
      {
        me.gen.translateText('exit-app').then(
          translatedText=>{ display(translatedText);}
        )
      }
    }
    );
  }

  ngOnDestroy() { 
    this.subscription.unsubscribe();
  }

  isHomePath(){
    var tab1 = (this.router.isActive('/tabs/tab1', true) && this.router.url === '/tabs/tab1');
    var tab2 = (this.router.isActive('/tabs/tab2', true) && this.router.url === '/tabs/tab2');
    var tab3 = (this.router.isActive('/tabs/tab3', true) && this.router.url === '/tabs/tab3');
    var tab4 = (this.router.isActive('/tabs/tab4', true) && this.router.url === '/tabs/tab4');

    return tab1 || tab2 || tab3 || tab4;
  }

  
}