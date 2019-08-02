import { GeneralService } from './../../services/general.service';
import { BluetoothService } from './../../services/bluetooth.service';
import { Component, ViewChild , OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { BluetoothInstructions } from '../../services/bluetooth-instructions.service';


@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.page.html',
  styleUrls: ['./sensor.page.scss'],
})
export class SensorPage implements OnInit, OnDestroy {

  @ViewChild('lineCanvas',null) lineCanvas;

  lineChart: any;
  dataSensor: number[];
  limitData: number = 100;
  Ymax: number = 1024;
  timer: any;

  isPlaying: boolean = false;
  isMoving: boolean = false;

  open_slow: string = "Open (slow)";
  open_fast : string = "Open (fast)";
  close_slow : string = "Close (slow)";
  close_fast : string = "Close (fast)";
  no_moves: string = "Stop";

  constructor(
    public bluetooth : BluetoothService,
    public cmd : BluetoothInstructions,
    public gen : GeneralService
  ) { }

  ngOnInit() {
    this.bluetooth.clearCmd();
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_DISABLE);
    this.dataSensor = [];
    //this.buildChart();
    this.bluetoothReceive();

    this.tradLabels()
    .then(
      _=>{
        this.buildChart();
      }
    )
  }

  ngOnDestroy(){
    this.stopTimer();
  }

  tradLabels() : Promise<boolean>
  {
    let me = this;
    return this.gen.translateText("open-slow")
    .then(
      text =>
      { 
        me.open_slow = text;
        return this.gen.translateText("open-fast")
        .then(
          text =>
          { 
            me.open_fast = text;
            return this.gen.translateText("no-moves")
            .then(
              text =>
              { 
                me.no_moves = text;
                return this.gen.translateText("close-slow")
                .then(
                  text =>
                  { 
                    me.close_slow = text;
                    return this.gen.translateText("close-fast")
                    .then(
                      text =>
                      { 
                        me.close_fast = text;
                        return Promise.resolve(true);
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    );
  }

  buildChart() {
    var yLabels = {
      0  : this.open_fast,
      400 : this.open_slow,
      500 : this.no_moves,
      600 : this.close_slow,
      1024 : this.close_fast
  }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
          labels: this.setQuantityOfData(this.limitData),
          datasets: [
              {
                  label: "Sensor Value",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderWidth:1,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: [],
                  spanGaps: false,
              }
          ],
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                  callback: function(value, index, values) {
                      return yLabels[value];
                  },
                  min: 0,
                  max: this.Ymax,
              }
            }],
            xAxes: [ { gridLines: { display: false } } ] 
        }
    }
    });
  }

  setQuantityOfData(quantity){
    var labelArray = [];

    for (var i = 0; i < quantity ; i++)
    {
      labelArray.push('');
    }
    return labelArray;
  }

  addNewData(data : number)
  {
    var value = +data ;//* 100 / 1023 ; // implicit cast as number
    //console.log(value);

    this.lineChart.data.datasets.forEach((dataset) => 
    {
      if (dataset.data.length < this.limitData){
        dataset.data.push(value);
      } else {
        this.shiftData(dataset.data, value);
      }
    });
    this.lineChart.update();
  }

  clearData()
    {
      this.lineChart.data.labels.pop();
      this.lineChart.data.datasets.forEach((dataset) => {
          dataset.data = [];
      });
      this.lineChart.update();
  }
  

  addData(dataset, data) {
    dataset.push(data);
  }


  shiftData(dataset, data) {
    dataset.push(data);
    dataset.shift();
  }


  startTimer(interval_ms)
  {
    let me = this;
    this.timer = setInterval( function(){me.callbackTimer()} , interval_ms);
    this.isPlaying = true;
  }

  stopTimer()
  {
    clearInterval(this.timer);
    this.isPlaying = false;
  }

  callbackTimer()
  {
    this.bluetooth.writeCmd(this.cmd.CMD_SENS_GET_VALUE);
  }

  onClickPlay()
  {
    this.startTimer(200);
  }
  onClickPause(){
    this.stopTimer();
  }

  onClickClear(){
    this.clearData();
  }

  onClickEnableMoves(){
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_ENABLE);
    this.isMoving = true;
    this.gen.toastTemp("moves-enabled", 1000);
  }

  onClickDisableMoves(){
    this.bluetooth.writeCmd(this.cmd.CMD_SRV_DISABLE);
    this.isMoving = false;
    this.gen.toastTemp("moves-disabled", 1000);
  }

  bluetoothReceive()
  {
    let me = this;
    this.bluetooth.receive().subscribe(
      data=>{
        // Bluetooth command interpreter here
        var command = +data[0];
        switch(command)
        {
          case me.cmd.CMD_SENS_GET_VALUE : 
            if (me.isPlaying){
              me.addNewData(data[1]);
            }
          break;

          default:break;
        }
      }
    );
  }
}
