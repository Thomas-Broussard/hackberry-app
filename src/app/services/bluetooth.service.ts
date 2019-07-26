import { HackberryDevice } from './../class/HackberryDevice';
/**
 * --------------------------------------------
 * Project : Hackberry App
 * Author : Thomas Broussard
 * --------------------------------------------
 * Name : BluetoothService
 * Type : Service
 * --------------------------------------------
 * Description : 
 * List of Methods used to interact with 
 * an Hackberry hand through Bluetooth
 * 
 * --------------------------------------------
 */

import { BluetoothInstructions } from './bluetooth-instructions.service';
import { GeneralService } from './general.service';
import { NavController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Injectable, Version } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class BluetoothService {

  private PARSECHAR = ';';
  private timer: any;

  private currentDevice: HackberryDevice = new HackberryDevice();

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
    public navCtrl: NavController,
    private router: Router,
  ) { }


  /**
   * Enable the bluetooth service
   */
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

  /**
   * Disable the bluetooth service
   */
  public disable(){
    this._isEnabled = false;
  }

  /**
   * Try to connect to a device
   * @param device bluetooth device to connect
   * @return (Observable) true if connected ; false otherwise 
   */
  public connect(device : any): Observable<boolean>
  {

      this.gen.toastTemp("Connecting to " + device.name + "...", 2000);
      
      return this.bluetoothSerial.connect(device.id).pipe(
        map((data) => {
        if(this.bluetoothSerial.isConnected())
        {
          this.currentDevice.setName(device.name);
          this.currentDevice.setId(device.id);
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

  /**
   * Check if bluetooth is connected to a device
   * return true if connected ; false otherwise
   */
  public isConnected()
  {
    return this._isConnected;
  }

  /**
   * Disconnect the bluetooth from device
   */
  public disconnect()
  {
    this.currentDevice.clear();
    this._isConnected = false;
    this.gen.toastTemp("Bluetooth disconnected", 2000);
  }

  /**
   * Get name and MAC address of the connected device
   * @return device object : device.name and device.id
   */
  public getConnectedDevice()
  {
    /*
    var device:any;
    if(this._isConnected){
      device.id = this.deviceId;
      device.name = this.deviceName;
    }
    return device;
    */

    if(this._isConnected){
      return this.currentDevice;
    }
    else{
      return null;
    }
  }

  /**
   * retrieve all the paired devices
   * @return list of paired devices
   */
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

  /**
   * discover all the unpaired devices
   * @return list of unpaired devices discovered
   */
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

  /**
   * Scan the paired and unpaired devices
   */
  public scan(){
    let me = this;
    this.bluetoothSerial.isEnabled().then(
      // connected
      function() {
        me.scanPaired();
        me.scanUnpaired();
      },
      // not connected
      function() {
        me.enable();
      }
    );
  }

  /**
   * send data to the device
   * @param data data to send
   */
  public write(data)
  {
    this.bluetoothSerial.write(data + "\r\n");
  }

  /**
   * method used to receive the data from the devices
   */
  public receive(): Observable<any>
  {
    return this.bluetoothSerial.subscribe('\r\n').pipe(
      map((data) => { 
        var result = data.split(this.PARSECHAR); 
        return result;
      })
    );
  }

  /**
   * Send a command to the hackberry hand 
   * @param command command to send 
   * @param data extra parameters (if required)
   */
  public writeCmd(command,data = null)
  {
    if(data != null){
      this.write(command + this.PARSECHAR + data);
    }
    else{
      this.write(command);
    }
  }

  /**
   * Launch a timer to check regularly if device is still connected
   */
  public startChecking()
  {
    let me = this;
    this.timer = setInterval( function(){me.callbackChecking()} , 3 * 1000); // check every 3s
  }

  /**
   * Stop the checking timer
   */
  public stopChecking()
  {
    clearInterval(this.timer);
  }

  /**
   * check if device is still connected or not
   */
  private callbackChecking()
  {
    let me = this;
    this.bluetoothSerial.isConnected().then(
      // device connected
      function(){
        me._isConnected = true;
      },
      // device disconnected
      function(){
        me._isConnected = false;
        me.stopChecking();
        me.gen.popup("Hand disconnected");

        // return to home if user was on hand driving pages
        if (me.router.url.includes('my-hand'))
        {
          me.navCtrl.navigateRoot('');
        }
        
      }
    );
  }

  /**
   * Get all general infos on the Hackberry Hand used
   */
  private retrieveInfos(){
    let me = this;
    this.receive().subscribe(
      data=>{
        // Bluetooth command interpreter here
        var command = +data[0];
        switch(command)
        {
          case me.cmd.CMD_GEN_VERSION : 
            me.currentDevice.setVersion(data[1]);
            me.writeCmd(me.cmd.CMD_SRV_GET_HAND);
          break;

          case me.cmd.CMD_SRV_GET_HAND : 
            if (data[1] == '1'){
              me.currentDevice.setHand("Right");
            }
            else{
              me.currentDevice.setHand("Left");
            }
            me.writeCmd(me.cmd.CMD_GEN_BOARD);
          break;

          case me.cmd.CMD_GEN_BOARD : 
            me.currentDevice.setBoard(data[1]);
          break;
          
          default:break;
        }
      }
    );
    this.writeCmd(this.cmd.CMD_GEN_VERSION);
  }


}
