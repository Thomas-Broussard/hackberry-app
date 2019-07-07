import { GeneralService } from './../../services/general.service';
import { BluetoothService } from './../../services/bluetooth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public bluetooth: BluetoothService,
    public gen : GeneralService) { }
}
