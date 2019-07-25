export class HackberryDevice {
  private id : string;
  private name : string;
  private version : string;
  private board : string;
  private hand : string;


  public init(){
    this.setName("Unknown");
    this.setId("Unknown");
    this.setVersion("???");
    this.setBoard("Unknown");
    this.setHand("Unknown");
  }

  public clear(){
    this.id = null;
    this.name = null;
    this.version = null;
    this.board = null;
    this.hand = null;
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
}