import { GeneralService } from './general.service';
import { NavController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  public deviceName: string = "";
  public deviceId: string = "";
  public isConnected:boolean = false;
  public listPairedDevices: any;
  public listUnpairedDevices: any;
  public isScanning: boolean = false;
  public isEnabled: boolean = true;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private gen : GeneralService,
    public navCtrl: NavController
  ) { }


  public enable(){
    let me = this;
    this.bluetoothSerial.enable().then(
      function() {

      },
      function() {
        me.isEnabled = false;
        me.gen.toastOK("Please enable Bluetooth");
      }
    );
  }

  public disable(){
    this.isEnabled = false;
  }


  public connect(device : any): Observable<boolean>
  {

      this.gen.toastTemp("Connecting to " + device.name + "...", 4000);
      
      return this.bluetoothSerial.connect(device.id).pipe(
        map((data) => {
        if(this.bluetoothSerial.isConnected())
        {
          this.deviceName = device.name;
          this.deviceId = device.id;
          this.isConnected = true;
          return true;
        } 
        else
        {
          this.isConnected = false;
          return false;
        }
        
      }));
  }

  public disconnect()
  {
    this.deviceName = "";
    this.deviceId = "";
    this.isConnected = false;
    this.gen.toastTemp("Bluetooth disconnected", 2000);
  }

  public getConnectedDevice()
  {
    var device:any;
    if(this.isConnected){
      device.id = this.deviceName;
      device.name = this.deviceId;
    }
    return device;
  }

  public checkConnection()
  {
    return this.bluetoothSerial.isConnected();
  }


  private scanPaired()
  {
    let me = this;
    this.listPairedDevices = [];
    this.bluetoothSerial.list().then(
      Deviceslist => {
        for (let key in Deviceslist) {
          me.listPairedDevices.push(Deviceslist[key]);
        }
      }
    );
  }

  private scanUnpaired()
  {
    let me = this;
    this.listUnpairedDevices = [];
    this.isScanning = true;
    this.bluetoothSerial.discoverUnpaired().then
    (
        devices => {
            devices.forEach(function(device) {
              me.listUnpairedDevices.push(device);
            });
            me.isScanning = false;
        }, 
        error => {
          me.gen.toastTemp(error, 2000);
          console.log(error);
          me.isScanning = false;
        }
    );
  }

  public scan(){
    let me = this;
    this.bluetoothSerial.isEnabled().then(
      function() {
        me.scanPaired();
        me.scanUnpaired();
      },
      function() {
        me.enable();
      }
    );
  }

  
}
