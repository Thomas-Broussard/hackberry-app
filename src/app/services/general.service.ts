import { Injectable } from '@angular/core';
import { ToastController, AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public APP_VERSION: String = "1.0.0";

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  // Display a notification on the bottom of the screen
  async toastOK(payload: string){
    const toast = await this.toastController.create(
      {
      message: payload,
      buttons: [
        {
          text:'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
      }
    );
    toast.present();
  }

  async toastTemp(payload: string, duration_ms: number){
    const toast = await this.toastController.create(
      {
      message: payload,
      duration: duration_ms,
      }
    );
    toast.present();
  }


  async popup(payload: string)
  {
    const alert = await this.alertController.create({
      header: payload,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

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

  async finish()
  {
    this.navCtrl.pop();
  }

}
