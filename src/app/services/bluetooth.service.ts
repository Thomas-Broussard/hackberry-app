import { BluetoothInstructions } from './bluetooth-instructions.service';
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

  private PARSECHAR = ';';

  public deviceName: string = "";
  public deviceId: string = "";
  
  public listPairedDevices: any;
  public listUnpairedDevices: any;

  public _isConnected:boolean = false;
  public _isScanning: boolean = false;
  public _isEnabled: boolean = true;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private cmd : BluetoothInstructions,
    private gen : GeneralService,
    public navCtrl: NavController
  ) { }


  public enable(){
    let me = this;
    this.bluetoothSerial.enable().then(
      function() {

      },
      function() {
        me._isEnabled = false;
        me.gen.toastOK("Please enable Bluetooth");
      }
    );
  }

  public disable(){
    this._isEnabled = false;
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
          this._isConnected = true;
          return true;
        } 
        else
        {
          this._isConnected = false;
          return false;
        }
        
      }));
  }

  public isConnected()
  {
    return this.bluetoothSerial.isConnected();
  }

  public disconnect()
  {
    this.deviceName = "";
    this.deviceId = "";
    this._isConnected = false;
    this.gen.toastTemp("Bluetooth disconnected", 2000);
  }

  public getConnectedDevice()
  {
    var device:any;
    if(this._isConnected){
      device.id = this.deviceName;
      device.name = this.deviceId;
    }
    return device;
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
    this._isScanning = true;
    this.bluetoothSerial.discoverUnpaired().then
    (
        devices => {
            devices.forEach(function(device) {
              me.listUnpairedDevices.push(device);
            });
            me._isScanning = false;
        }, 
        error => {
          me.gen.toastTemp(error, 2000);
          console.log(error);
          me._isScanning = false;
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

  public write(data)
  {
    this.bluetoothSerial.write(data + "\r\n");
  }

  public receive(): Observable<any>
  {
    return this.bluetoothSerial.subscribe('\r\n').pipe(
      map((data) => { 
        var result = data.split(this.PARSECHAR); 
        return result;
      })
    );
  }

  public writeCmd(command,data = null)
  {
    if(data != null){
      this.write(command + this.PARSECHAR + data);
    }
    else{
      this.write(command);
    }
  }


}
