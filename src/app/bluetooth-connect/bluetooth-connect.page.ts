import { GeneralService } from './../services/general.service';
import { BluetoothService } from './../services/bluetooth.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-bluetooth-connect',
  templateUrl: './bluetooth-connect.page.html',
  styleUrls: ['./bluetooth-connect.page.scss'],
})

export class BluetoothConnectPage implements OnInit {

  listPairedDevices: any;
  listUnpairedDevices: any;
  connectedDevice: string;

  isScanning: boolean = false;
  noDeviceFound: boolean = false;

  constructor(
    public bluetooth : BluetoothService,
    public gen : GeneralService
    ) { }

  ngOnInit()
  {
    this.bluetooth.scan();
  }

  connect(device: any){
    this.bluetooth.connect(device).subscribe(
      (isConnected: boolean)=>
      {
        if (isConnected){
          console.log("Successfully Connected ! ");
          this.gen.toastTemp("Successfully Connected ! ", 2000);
          this.gen.finish();
          this.bluetooth.startChecking();
        } else {
          console.log("Connection Failure...");
          this.gen.toastOK("Error during connection. Please retry");
        }
      }
    )
  }
}