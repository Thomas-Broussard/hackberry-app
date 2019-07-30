import { GeneralService } from './../../services/general.service';
import { HackberryDocService } from './../../services/pdf/hackberry-doc.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  constructor(
    private doc : HackberryDocService,
    private gen : GeneralService) {}

  downloadRequired : boolean = false;
  countryCode : string = "fr";
  
  ngOnInit()
  {
  }
  /**
   * open the doc if present in memory or download it if not
   */
  openDoc(name)
  {
    let me = this;
    this.gen.getLanguage().then(
      result => {
        me.countryCode = result;
        this.doc.openOrDownload(name, me.countryCode); 
      }
    );
    
  }
}

class PDFDocument{
  public url: string;
  public name: string;
}