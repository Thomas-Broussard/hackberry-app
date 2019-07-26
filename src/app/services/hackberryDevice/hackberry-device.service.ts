import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HackberryDevice {
  private id : string;
  private name : string;
  private version : string;
  private board : string;
  private hand : string;
  private battery : number;

  constructor() { }

  public clear(){
    this.id = null;
    this.name = null;
    this.version = null;
    this.board = null;
    this.hand = null;
    this.battery = -1;
  }
  /*
  -------------------------
  ID (mac address)
  -------------------------
  */
  public getId()
  {
    return this.id;
  }
  public setId(id)
  {
    this.id = id;
  }

  /*
  -------------------------
  Name
  -------------------------
  */
 public getName()
 {
   return this.name;
 }
 public setName(name)
 {
   this.name = name;
 }

 /*
  -------------------------
  ID (mac address)
  -------------------------
  */
 public getVersion()
 {
   return this.version;
 }
 public setVersion(version)
 {
   this.version = version;
 }

 /*
  -------------------------
  ID (mac address)
  -------------------------
  */
 public getBoard()
 {
   return this.board;
 }
 public setBoard(board)
 {
   this.board = board;
 }

 /*
  -------------------------
  ID (mac address)
  -------------------------
  */
 public getHand()
 {
   return this.hand;
 }
 public setHand(hand)
 {
   this.hand = hand;
 }

 /*
  -------------------------
  ID (mac address)
  -------------------------
  */
 public getBattery()
 {
   return this.battery;
 }
 public setBattery(battery)
 {
   if (battery > 100 || battery < 0){
    this.battery = -1;
   }
   else
   {
     this.battery = battery;
   }
 }
}