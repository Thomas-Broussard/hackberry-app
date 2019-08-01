import { HackberryDocService } from './../services/pdf/hackberry-doc.service';
import { GeneralService } from './../services/general.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private gen : GeneralService,
    private changeref: ChangeDetectorRef,
    private doc : HackberryDocService,
    ) { }

  isUpdateAvailable : boolean = false;
  countryCode : string;

  ngOnInit() {
    let me = this;
    this.gen.getLanguage().then(
      result => {
        me.countryCode = result;
        console.log("getLanguage = " + result);
        me.changeref.detectChanges();
      }
    );
  }

  ionViewWillEnter()
  {
    console.log("ionWillEnter");
    this.checkUpdate();
  }

  isCountrySelected(countryCode: string)
  {
    return countryCode == this.countryCode;
  }

  onLanguageChange(event)
  {
    var language = event.detail.value;
    this.countryCode = language;
    this.gen.setLanguage(language);
  }


  downloadAllDocs()
  {
    this.doc.downloadLatestDocs(); 
  }

  checkUpdate()
  {
    let me = this;
    if (this.gen.isConnectedToInternet())
    {
      this.doc.isUpdateAvailable().then(
        result =>
        {
          me.isUpdateAvailable = result;
          me.changeref.detectChanges();
        }
      ).catch(
        err=>{
          me.isUpdateAvailable = false;
        }
      )
    }
    else{
      me.isUpdateAvailable = false;
      me.changeref.detectChanges();
    }
  }

  deleteAllDocs()
  {
    this.doc.eraseAllDocs();
  }

}
