import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.page.html',
  styleUrls: ['./infos.page.scss'],
})
export class InfosPage implements OnInit {

  constructor(
    public bluetooth : BluetoothService
  ) { }

  ngOnInit() {
  }

}
