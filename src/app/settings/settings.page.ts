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
    private changeref: ChangeDetectorRef
    ) { }

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

}
