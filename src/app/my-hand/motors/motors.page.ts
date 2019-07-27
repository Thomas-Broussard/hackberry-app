import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit } from '@angular/core';
import { BluetoothInstructions } from '../../services/bluetooth-instructions.service';

@Component({
  selector: 'app-motors',
  templateUrl: './motors.page.html',
  styleUrls: ['./motors.page.scss'],
})
export class MotorsPage implements OnInit {

  thumb: any = {min:0, max:180, current:0};
  index: any = {min:28, max:150, current:0};
  fingers: any = {min:0, max:180, current:0};

  constructor(
    public bluetooth : BluetoothService,
    public cmd: BluetoothInstructions
  ) { }

  ngOnInit() {
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_DISABLE);
    this.thumb.current = (this.thumb.min + this.thumb.max) / 2;
    this.index.current = (this.index.min + this.index.max) / 2;
    this.fingers.current = (this.fingers.min + this.fingers.max) / 2;

  }

  moveThumb(event)
  {
    var degree = event.detail.value
    console.log("Thumb Move: " + degree);

    var data = "1;" + degree;
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_MOVE, data);
  }

  moveIndex(event)
  {
    var degree = event.detail.value
    console.log("Index Move: " + degree);

    var data = "2;" + degree;
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_MOVE, data);
  }

  moveFingers(event)
  {
    var degree = event.detail.value
    console.log("Fingers Move: " + degree);

    var data = "3;" + degree;
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_MOVE, data);
  }


}
