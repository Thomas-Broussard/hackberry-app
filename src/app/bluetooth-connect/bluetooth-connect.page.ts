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
  timeConnect_ms : number = 5000;

  constructor(
    public bluetooth : BluetoothService,
    public gen : GeneralService
    ) { }

  ngOnInit()
  {
    this.bluetooth.scan();
  }

  connect(device: any)
  {
    let me = this;
    this.gen.popupTemp("progress-connect", this.timeConnect_ms);
    this.bluetooth.connect(device).subscribe(
      (isConnected: boolean)=>
      {
        if (isConnected){
          this.gen.dismiss();
          console.log("Successfully Connected ! ");
          this.gen.toastTemp("success-connected", 2000);
          this.gen.finish();
        } else {
          //console.log("Connection Failure...");
          //this.gen.toastOK("Error during connection. Please retry");
        }
      }
    )
    
    // display message if bluetooth is not connected after timeConnect_ms duration
    setTimeout( () => {
      if (!me.bluetooth.isConnected())
      {
        me.gen.toastTemp("fail-connected",2000);
      }
    }, this.timeConnect_ms);
  }
}