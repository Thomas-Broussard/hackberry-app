import { GeneralService } from './../../services/general.service';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  constructor(
    public navCtrl: NavController,
    public gen: GeneralService
    ) {}
    
}
