import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-bluetooth-connect',
  templateUrl: './bluetooth-connect.page.html',
  styleUrls: ['./bluetooth-connect.page.scss'],
})
export class BluetoothConnectPage implements OnInit {

  listBTDevices: any;
  connectedDevice: string;

  
  constructor(
    private bluetoothSerial: BluetoothSerial,
    public toastController: ToastController
    ) {
      this.listBTDevices = [];
      this.checkBT();
  }

  ngOnInit()
  {
    
  }

  checkBT() {
    let me = this;
    me.bluetoothSerial.isEnabled().then(
      function() {
        me.scan();;
        me.getListBT();
      },
      function() {
        me.enableBT();
      }
    );
  }

  enableBT() {
    let me = this;
    me.bluetoothSerial.enable().then(
      function() {
        me.scan();
        me.getListBT();
      },
      function() {
        me.notification("The user did *not* enable Bluetooth");
      }
    );
  }

  scan() {
    let me = this;
    me.bluetoothSerial.discoverUnpaired().then
    (
        devices => {
            alert('Devices: ' + JSON.stringify(devices));
            devices.forEach(function(device) {
              me.notification(device.name);
            })
        }, 
        error => {
          me.notification(error);
        }
    );
    me.bluetoothSerial.setDeviceDiscoveredListener().subscribe(
        device => {
          me.notification('Found: ' + device.id + '\n' + device.name);
        },
        error => {
          me.notification('Error scan: ' + JSON.stringify(error));
        }
    );
  }

  getListBT() {
    let me = this;
    this.bluetoothSerial.list().then(
      Deviceslist => {
        for (let key in Deviceslist) {
          me.listBTDevices.push(Deviceslist[key]);
        }
      }
    );
  }

  async notification(payload: string){
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

}