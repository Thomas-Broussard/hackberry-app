import { GeneralService } from './../../services/general.service';
import { BluetoothInstructions } from './../../services/bluetooth-instructions.service';
import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sensor-calib',
  templateUrl: './sensor-calib.page.html',
  styleUrls: ['./sensor-calib.page.scss'],
})
export class SensorCalibPage implements OnInit {

  constructor(
    public bluetooth : BluetoothService,
    public cmd : BluetoothInstructions,
    public gen : GeneralService
  ) { }

  ngOnInit() {
    this.bluetooth.clearCmd();
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_ENABLE);
    this.receiveBluetooth();
  }

  onClickCalib(){
    this.bluetooth.writeCmd(this.cmd.CMD_SENS_CALIB);
    this.gen.popupTemp("progress-calib", 10000);
  }

  receiveBluetooth()
  {
    let me = this;
    this.bluetooth.receive().subscribe(
      data=>{
        // Bluetooth command interpreter here
        var command = +data[0];
        switch(command)
        {
          case me.cmd.CMD_SENS_CALIB : 
            me.gen.popupTemp("progress-calib", 10000);
          break;
          default:break;
        }
      }
    );
  }

}
