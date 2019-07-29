import { GeneralService } from './../../services/general.service';
import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BluetoothInstructions } from '../../services/bluetooth-instructions.service';

@Component({
  selector: 'app-motors',
  templateUrl: './motors.page.html',
  styleUrls: ['./motors.page.scss'],
})
export class MotorsPage implements OnInit {

  thumb: any = {min:0, max:180, current:90};
  index: any = {min:0, max:180, current:90};
  fingers: any = {min:0, max:180, current:90};
  countChange: number = 0;
  enableMoves: boolean = false;

  constructor(
    public bluetooth : BluetoothService,
    public cmd: BluetoothInstructions,
    public gen: GeneralService,
    public changeref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.receiveBluetooth();
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_DISABLE);
    /*this.thumb.current = (this.thumb.min + this.thumb.max) / 2;
    this.index.current = (this.index.min + this.index.max) / 2;
    this.fingers.current = (this.fingers.min + this.fingers.max) / 2;*/
    this.getLimitPositions();
    this.getCurrentPositions();
  }

  moveThumb(event)
  {
    if (!this.enableMoves) return;
    var degree = event.detail.value
    console.log("Thumb Move: " + degree);

    var data =  this.gen.THUMB + ";" + degree;
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_MOVE, data);
  }

  moveIndex(event)
  {
    if (!this.enableMoves) return;
    var degree = event.detail.value
    console.log("Index Move: " + degree);

    var data =  this.gen.INDEX + ";" + degree;
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_MOVE, data);
  }

  moveFingers(event)
  {
    if (!this.enableMoves) return;
    var degree = event.detail.value
    console.log("Fingers Move: " + degree);

    var data = this.gen.FINGERS + ";" + degree;
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_MOVE, data);
  }

  getLimitPositions()
  {
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_LOAD_MIN,this.gen.THUMB);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_LOAD_MIN,this.gen.INDEX);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_LOAD_MIN,this.gen.FINGERS);

    this.bluetooth.writeCmd(this.cmd.CMD_SRV_LOAD_MAX,this.gen.THUMB);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_LOAD_MAX,this.gen.INDEX);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_LOAD_MAX,this.gen.FINGERS);
  }

  getCurrentPositions()
  {
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.gen.THUMB);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.gen.INDEX);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.gen.FINGERS);
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
          case me.cmd.CMD_SRV_GET_POS : 
            var member = +data[1];
            var position = +data[2];

            switch(member)
            {
              case me.gen.THUMB :
                me.thumb.current = position;
              break;

              case me.gen.INDEX :
                  me.index.current = position;
              break;

              case me.gen.FINGERS :
                  me.fingers.current = position;
              break;
            }
            me.countChange += 1;
          break;

          case me.cmd.CMD_SRV_LOAD_MIN :
              var member = +data[1];
              var position = +data[2];
  
              switch(member)
              {
                case me.gen.THUMB :
                  me.thumb.min = position;
                break;
  
                case me.gen.INDEX :
                    me.index.min = position;
                break;
  
                case me.gen.FINGERS :
                    me.fingers.min = position;
                break;
              }
              me.countChange += 1;
          break;

          case me.cmd.CMD_SRV_LOAD_MAX :
              var member = +data[1];
              var position = +data[2];
  
              switch(member)
              {
                case me.gen.THUMB :
                  me.thumb.max = position;
                break;
  
                case me.gen.INDEX :
                    me.index.max = position;
                break;
  
                case me.gen.FINGERS :
                    me.fingers.max = position;
                break;
              }
              me.countChange += 1;
          break;
        }
        if (me.countChange >= 9)
        {
          me.countChange = 0;
          me.changeref.detectChanges();
          me.enableMoves = true;
        }
      }
    );
  }
}
