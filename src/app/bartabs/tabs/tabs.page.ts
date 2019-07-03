import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy, AfterViewInit{

  constructor(private platform : Platform,
              private alertController : AlertController,
              private router : Router) {}

  subscription : any ;

  ngOnInit() { }
  
  ngAfterViewInit() {
    this.subscription = this.platform.backButton.subscribe(async () => {
      if (this.isHomePath()) {
        const alert = await this.alertController.create({
          header: 'Close app?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'Close',
              handler: () => {
                navigator['app'].exitApp();
              }
            }
          ]
        });
    
        await alert.present();
      }
    });
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