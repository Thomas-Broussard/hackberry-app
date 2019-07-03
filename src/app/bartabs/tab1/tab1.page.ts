import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  constructor(private alertController: AlertController) { }


  async closeApp()
  {
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
}
