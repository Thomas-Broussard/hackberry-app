import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { ToastController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public APP_VERSION: String = "1.0.0";

  public THUMB : number = 1;
  public INDEX : number = 2;
  public FINGERS : number = 3;

  private _toast;
  private _popup;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private navCtrl: NavController,
    public loadingController: LoadingController,
    private file: File,
    private translate : TranslateService,
    private network: Network
  ) { }

  // Display a notification on the bottom of the screen
  async toastOK(payload: string)
  {
    async function display(text){
      this._toast = await this.toastController.create(
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
      this._toast.present();
    }
    this.translateText(payload).then(
      translatedText =>{
        display(translatedText)
      }
    )
  }

  async toastTemp(payload: string, duration_ms: number)
  {
    async function display(text){
      this._toast = await this.toastController.create(
        {
        message: text,
        duration: duration_ms,
        }
      );
      this._toast.present();
    }
    this.translateText(payload).then(
      translatedText =>{
        display(translatedText)
      }
    )
  }


  async popup(payload: string)
  {
    async function display(text){
      this._popup = await this.alertController.create({
        header: text,
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });

      await this._popup.present();
    }
    this.translateText(payload).then(
      translatedText =>{
        display(translatedText)
      }
    )
  }
 
  async popupTemp(payload: string, delay_ms: number)
  {
    async function display(text){
      this._popup = await this.loadingController.create({
        spinner: 'crescent',
        duration: delay_ms,
        message: text,
        translucent: true,
      });
      return await this._popup.present();
    }
    this.translateText(payload).then(
      translatedText =>{
        display(translatedText)
      }
    )
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

  /** go to previous page */
  async finish()
  {
    this.navCtrl.pop();
  }

  async dismiss()
  {
    this.alertController.dismiss();
    this.loadingController.dismiss();
  }


  

  setLanguage(countryCode : string)
  {
    let me = this;
    let filePath = this.file.dataDirectory;
    this.file.createFile(filePath,'language',true).then(
      result => {
        me.file.writeExistingFile(filePath,'language',countryCode);
        me.translate.use(countryCode);
      })
  }

  getLanguage()
  {
    let filePath = this.file.dataDirectory;
    let me = this;

    return this.file.readAsText(filePath, 'language').then(
      language => 
      {
        console.log("language : " + language);
        me.translate.use(language);
        return language;
      })
      .catch(
        err =>
        {
          let default_language = this.translate.getDefaultLang();
          console.log("language file not found");
          me.setLanguage(default_language);
          return default_language;
        }
      );
  }


  isConnectedToInternet(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  translateText(translationKey: string) : Promise<string>
  {
    return this.translate.get(translationKey).toPromise()
    .then(
      translatedText =>{ return translatedText;}
    )
    .catch(err => { return translationKey; });
  }
  
}
