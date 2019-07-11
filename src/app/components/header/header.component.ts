import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() Title: string;
  private batteryLevel: number = 100;

  constructor(
    bluetooth : BluetoothService
  ) { }

  ngOnInit() {}

}
