import { PdfService } from './../../services/pdf/pdf.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private pdf : PdfService) {}

  downloadRequired : boolean = false

  // list all documents here
  assemblyGuide : PDFDocument = { name :"assembly-guide", url:"https://github.com/Thomas-Broussard/hackberry-app/raw/master/src/assets/pdf/assembly-guide.pdf"};

  /**
   * open the doc if present in memory or download it if not
   */
  openDoc(doc)
  {
    this.pdf.openOrDownload(doc.name,doc.url); 
  }
}

class PDFDocument{
  public url: string;
  public name: string;
}