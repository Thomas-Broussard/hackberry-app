import { HackberryDevice } from './../../class/HackberryDevice';
import { BluetoothInstructions } from './../../services/bluetooth-instructions.service';
import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.page.html',
  styleUrls: ['./infos.page.scss'],
})
export class InfosPage implements OnInit, OnDestroy {

  device : HackberryDevice = new HackberryDevice();
  
  batteryLevel :number = 0;
  timer;


  constructor(
    public bluetooth : BluetoothService,
    public cmd : BluetoothInstructions
  ) { }

  ngOnInit() {

    this.device.init();

    this.receiveInfos();
    this.askInfos();

    // check battery level every 10 seconds
    let me = this;
    this.timer = setInterval( function(){me.bluetooth.writeCmd(me.cmd.CMD_GEN_BATTERY)} , 10 * 1000); 
  }

  ngOnDestroy(){
    // stop checking battery
    clearInterval(this.timer);
  }


  askInfos(){
    this.device = this.bluetooth.getConnectedDevice();

    this.bluetooth.writeCmd(this.cmd.CMD_GEN_VERSION);
  }

  receiveInfos(){
    let me = this;
    this.bluetooth.receive().subscribe(
      data=>{
        // Bluetooth command interpreter here
        var command = +data[0];
        switch(command)
        {
          case me.cmd.CMD_GEN_BATTERY : 
            me.batteryLevel = data[1];
          break;

          case me.cmd.CMD_GEN_VERSION : 
            me.device.setVersion(data[1]);
            me.bluetooth.writeCmd(me.cmd.CMD_SRV_GET_HAND);
          break;

          case me.cmd.CMD_SRV_GET_HAND : 
          if (data[1] == '1'){
            me.device.setHand("Right");
          }
          else{
            me.device.setHand("Left");
          }
          me.bluetooth.writeCmd(me.cmd.CMD_GEN_BOARD);
          break;

          case me.cmd.CMD_GEN_BOARD : 
            me.device.setBoard(data[1]);
          break;
          
          default:break;
        }
      }
    );
  }

}
