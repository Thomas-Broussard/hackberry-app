import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';

@Injectable({
  providedIn: 'root'
})
export class HackberryDocService {

  
  constructor(private pdf : PdfService) { }

  private mainURL: string = "https://github.com/Thomas-Broussard/hackberry-docs/raw/master/";

  /**
   * Get the URL to download a file
   * @param name name of the file
   * @param countryCode language wanted (fr, en , jp)
   */
  getFileURL(name: string, countryCode: string)
  {
    return this.mainURL + countryCode + '/' + name + ".pdf";
  }

  openOrDownload(name: string, countryCode: string)
  {
    var url = this.getFileURL(name,countryCode);
    var languageName = name + '_' + countryCode;
    this.pdf.openOrDownload(languageName,url);
  }

  download(name: string, countryCode: string)
  {
    var url = this.getFileURL(name,countryCode);
    var languageName = name + '_' + countryCode;
    this.pdf.download(languageName,url);
  }
}
