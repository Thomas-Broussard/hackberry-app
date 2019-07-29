import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    private platform: Platform, 
    private file: File, 
    private ft: FileTransfer, 
    private fileOpener: FileOpener, 
    private document: DocumentViewer,
    ) { }

    openLocalPdf(name: string) {
      let filePath = this.file.applicationDirectory + 'www/assets';
      let fileName = 'pdf/' + name + '.pdf';
      if (this.platform.is('android')) 
      {
        this.file.copyFile(filePath, fileName, this.file.dataDirectory, `${name}.pdf`).then(
          result => {
            this.fileOpener.open(result.nativeURL, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
          })
      } else 
      {
        // Use Document viewer for iOS for a better UI
        const options: DocumentViewerOptions = {
          title: 'My PDF'
        }
        this.document.viewDocument(`${filePath}/${fileName}`, 'application/pdf', options);
      }
    }

  
}
