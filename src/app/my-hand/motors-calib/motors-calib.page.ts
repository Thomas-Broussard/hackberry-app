import { GeneralService } from './../../services/general.service';
import { BluetoothInstructions } from './../../services/bluetooth-instructions.service';
import { BluetoothService } from './../../services/bluetooth.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';  

enum Steps{
  THUMB_OPEN,
  THUMB_CLOSE,
  INDEX_OPEN,
  INDEX_CLOSE,
  FINGERS_OPEN,
  FINGERS_CLOSE,
  END
};  

@Component({
  selector: 'app-motors-calib',
  templateUrl: './motors-calib.page.html',
  styleUrls: ['./motors-calib.page.scss'],
})

export class MotorsCalibPage implements OnInit 
{
  // slides variables
  @ViewChild('slides',null) slides: IonSlides;
  sliderConfig = {
    simulateTouch: false
  }
  constructor(
    public bluetooth : BluetoothService,
    public cmd: BluetoothInstructions,
    public gen : GeneralService,
    private changeref: ChangeDetectorRef
  ) { }

  // variables
  currentStep: Steps = 0;
  countACK: number = 0;
  targetACK: number = 0;
  thumb: any = {id : this.gen.THUMB , open:0, close:0, skipClose:false, skipOpen:false};
  index: any = {id : this.gen.INDEX , open:0, close:0, skipClose:false, skipOpen:false};
  fingers: any = {id : this.gen.FINGERS , open:0, close:0, skipClose:false, skipOpen:false};

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.receiveBluetooth();
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_DISABLE);
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.thumb.id);
  }

  prevStep()
  {
    this.currentStep -=1;
    console.log("current Step = " + this.currentStep);
    this.executeStep();
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  nextStep(){
    this.currentStep +=1;
    console.log("current Step = " + this.currentStep);
    this.executeStep();
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }
  
  executeStep(){
    switch(this.currentStep)
    {
      case Steps.THUMB_OPEN:
          console.log("thumb");
      case Steps.THUMB_CLOSE:
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.thumb.id);
      break;

      case Steps.INDEX_OPEN:
          console.log("index");
      case Steps.INDEX_CLOSE:
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.index.id);
      break;

      case Steps.FINGERS_OPEN:
      console.log("fingers");
      case Steps.FINGERS_CLOSE:
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_GET_POS,this.fingers.id);
      break;

      case Steps.END:
          console.log("end");
          this.finishCalib();
      break;
    }
  }

  next(){
    switch(this.currentStep)
    {
      case Steps.THUMB_OPEN:
        this.thumb.skipOpen = false;
      break;
      case Steps.THUMB_CLOSE:
          this.thumb.skipClose = false;
      break;

      case Steps.INDEX_OPEN:
          this.index.skipOpen = false;
      break;
      case Steps.INDEX_CLOSE:
          this.index.skipClose = false;
      break;

      case Steps.FINGERS_OPEN:
          this.fingers.skipOpen = false;
      break;
      case Steps.FINGERS_CLOSE:
          this.fingers.skipClose = false;
      break;
    }
    this.nextStep();
    this.targetACK +=1;
  }

  skip(){
    switch(this.currentStep)
    {
      case Steps.THUMB_OPEN:
        this.thumb.skipOpen = true;
      break;
      case Steps.THUMB_CLOSE:
          this.thumb.skipClose = true;
      break;

      case Steps.INDEX_OPEN:
          this.index.skipOpen = true;
      break;
      case Steps.INDEX_CLOSE:
          this.index.skipClose = true;
      break;

      case Steps.FINGERS_OPEN:
          this.fingers.skipOpen = true;
      break;
      case Steps.FINGERS_CLOSE:
          this.fingers.skipClose = true;
      break;
    }
    this.nextStep();
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
            console.log ("member = " + member + " ; pos = " + position);

            switch(me.currentStep)
            {
              case Steps.THUMB_OPEN:
                  me.thumb.open = position;
              break;
              case Steps.THUMB_CLOSE:
                  me.thumb.close = position;
              break;

              case Steps.INDEX_OPEN:
                  me.index.open = position;
              break;
              case Steps.INDEX_CLOSE:
                  me.index.close = position;
              break;

              case Steps.FINGERS_OPEN:
                  me.fingers.open = position;
              break;
              case Steps.FINGERS_CLOSE:
                  me.fingers.close = position;
              break;
            }
            me.changeref.detectChanges();
          break;

          case me.cmd.CMD_SRV_SAVE_MIN : 
          case me.cmd.CMD_SRV_SAVE_MAX :
            me.countACK += 1;

            if (me.countACK == me.targetACK){
              me.gen.toastTemp("success-calib",1000);
              me.gen.finish();
            }
          default:break;
        }
      }
    );
  }

  finishCalib()
  {
    this.countACK = 0;
    if (this.targetACK > 0){
      this.savePositions(this.thumb);
      this.savePositions(this.index);
      this.savePositions(this.fingers);
    }
    else
    {
      this.gen.toastTemp("success-calib",1500);
      this.gen.finish();
    }
    
    
  }
  
  cancelCalib()
  {
    this.gen.toastTemp("cancel-calib",1500);
    this.gen.finish();
  }

  savePositions(member: any)
  {
    var min = (member.open < member.close) ? member.open : member.close; 
    var max = (member.open > member.close) ? member.open : member.close;

    if ((min == member.open && member.skipOpen == false) || (min == member.close && member.skipClose == false))
    {
      var paramMin: String = member.id + ';' + min;
      this.bluetooth.writeCmd(this.cmd.CMD_SRV_SAVE_MIN,paramMin);
    }
    if ((max == member.open && member.skipOpen == false) || (max == member.close && member.skipClose == false))
    {
      var paramMax: String = member.id + ';' + max;
      this.bluetooth.writeCmd(this.cmd.CMD_SRV_SAVE_MAX,paramMax);
    }
  }

  increment(value, increment){
    var result = value + increment;
    if (result > 180) return 180;
    if (result < 0) return 0;
    return result;
  }
  decrement(value, decrement){
    var result = value - decrement;
    if (result > 180) return 180;
    if (result < 0) return 0;
    return result;
  }

  incrementRange(member, open)
  {
    var degree = 5;
    if (open)
    {
      switch(member){
        case this.gen.THUMB:
          this.thumb.open = this.increment(this.thumb.open,degree);
        break;
        case this.gen.INDEX:
          this.index.open = this.increment(this.index.open,degree);
        break;
        case this.gen.FINGERS:
          this.fingers.open = this.increment(this.fingers.open,degree);
        break;
      }
    }
    else
    {
      switch(member){
        case this.gen.THUMB:
          this.thumb.close = this.increment(this.thumb.close,degree);
        break;
        case this.gen.INDEX:
          this.index.close = this.increment(this.index.close,degree);
        break;
        case this.gen.FINGERS:
          this.fingers.close = this.increment(this.fingers.close,degree);
        break;
      }
    }
  }

  decrementRange(member, open)
  {
    var degree = 5;
    if (open)
    {
      switch(member){
        case this.gen.THUMB:
          this.thumb.open = this.decrement(this.thumb.open,degree);
        break;
        case this.gen.INDEX:
          this.index.open = this.decrement(this.index.open,degree);
        break;
        case this.gen.FINGERS:
          this.fingers.open = this.decrement(this.fingers.open,degree);
        break;
      }
    }
    else
    {
      switch(member){
        case this.gen.THUMB:
          this.thumb.close = this.decrement(this.thumb.close,degree);
        break;
        case this.gen.INDEX:
          this.index.close = this.decrement(this.index.close,degree);
        break;
        case this.gen.FINGERS:
          this.fingers.close = this.decrement(this.fingers.close,degree);
        break;
      }
    }
  }

  moveRange(member, open: Boolean, event)
  {
    var degree = event.detail.value;
    if (degree > 0 && degree < 180)
    {
    if (open)
    {
      switch(member){
        case this.gen.THUMB:
          this.thumb.open = degree;
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_FORCE_MOVE, this.thumb.id + ";" + this.thumb.open);
        break;
        case this.gen.INDEX:
          this.index.open = degree;
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_FORCE_MOVE, this.index.id + ";" + this.index.open);
        break;
        case this.gen.FINGERS:
          this.fingers.open = degree;
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_FORCE_MOVE, this.fingers.id + ";" + this.fingers.open);
        break;
      }
    }
    else
    {
      switch(member){
        case this.gen.THUMB:
          this.thumb.close = degree;
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_FORCE_MOVE, this.thumb.id + ";" + this.thumb.close);
        break;
        case this.gen.INDEX:
          this.index.close = degree;
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_FORCE_MOVE, this.index.id + ";" + this.index.close);
        break;
        case this.gen.FINGERS:
          this.fingers.close = degree;
          this.bluetooth.writeCmd(this.cmd.CMD_SRV_FORCE_MOVE, this.fingers.id + ";" + this.fingers.close);
        break;
      }
    }
    }
    
  }

}
