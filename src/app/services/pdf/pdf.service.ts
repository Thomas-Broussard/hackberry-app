import { GeneralService } from './../general.service';
import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

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
    private gen : GeneralService,
    ) { }

    docPath: string = this.file.externalRootDirectory;
    docDir:  string = "HackberryDoc";
    docFullPath: string  = this.docPath + this.docDir + "/";
    

    /**
     * Move a PDF file from assets/ to dataDirectory/pdf/ and open it
     * @param name 
     */
    openFromAssets(name: string) 
    {
      let filePath = this.file.applicationDirectory + 'www/assets';
      let fileName = 'pdf/' + name + '.pdf';

      if (this.platform.is('android')) 
      {
        this.file.copyFile(filePath, fileName, this.docFullPath, `${name}.pdf`).then(
          result => {
            this.fileOpener.open(result.nativeURL, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
          })
      } 
      else 
      {
        // Use Document viewer for iOS for a better UI
        const options: DocumentViewerOptions = {
          title: 'My PDF'
        }
        this.document.viewDocument(`${filePath}/${fileName}`, 'application/pdf', options);
      }
    }

    /**
     * download a pdf file from an url and save it in dataDirectory/pdf/
     * @param name name of the file
     * @param url url to download the file
     */
    download(name:string,url: string)
    {
    }

    /**
     * Open a PDF file from dataDirectory/pdf/
     * @param name 
     */
    open(name: string) {
      if (this.platform.is('android')) 
      {
        this.fileOpener.open(this.docFullPath + `${name}.pdf`, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
      } 
      else 
      {
        // Use Document viewer for iOS for a better UI
        const options: DocumentViewerOptions = {
          title: 'My PDF'
        }
        this.document.viewDocument(this.docFullPath + `${name}.pdf`, 'application/pdf', options);
      }
    }

    /**
     * download a pdf file from an url, save it in dataDirectory/pdf/ and open it
     * @param name name of the file
     * @param url url to download the file
     */
    openFromURL(name:string,url: string)
    {
      let me = this;
      this.gen.popupTemp("Downloading " + name + "...", 600000);
      const fileTransfer: FileTransferObject = this.ft.create();

      this.file.checkDir(me.docPath, me.docDir)
		  .then(
			// Directory exists, download the file and open it
        _ => 
        fileTransfer.download(url,me.docFullPath + name + '.pdf')
        .then(
          (entry) => 
            {
              console.log('file download response',entry);
              me.open(name);
              me.gen.dismiss();
            }
        )
        .catch(
          (err) =>{
            console.log('error in file download',err);
            me.gen.dismiss();
            me.gen.toastTemp("Error : can't download File", 2000);
          }
        )
      )
      .catch(
        // Directory does not exists, create a new one, then download and open the file
        err => 		
          me.file.createDir(me.docPath, me.docDir, false)
          .then(
            response => {
              console.log('Directory created',response);
              fileTransfer.download(url,me.docFullPath + name + '.pdf').then((entry) => 
              {
                  console.log('file download response',entry);
                  me.open(name);
                  me.gen.dismiss();
              })
              .catch((err) =>{
                  console.log('error in file download',err);
                  me.gen.dismiss();
                  me.gen.toastTemp("Error : can't download File", 2000);
              });
            }
          )
          .catch(
            err => {
              console.log('Could not create directory "my_downloads" ',err);
              me.gen.dismiss();
              me.gen.toastTemp("Error : can't download File", 2000);
            }
          ) 
      );		
    }

    /**
     * open the file if it exists or download it if not
     * @param name name of the file to open
     * @param url url to download the file 
     */    
    openOrDownload(name:string , url: string)
    {
      let me = this;
      console.log("checking file " + me.docFullPath + name + '.pdf');
      this.file.checkFile(me.docFullPath, name + '.pdf')
      .then(
        (file) => {
          console.log("files found" + file)
          me.open(name);
        }
      ).catch(
        (err) => {
          console.log("files not found. Download it now")
          me.openFromURL(name,url);
        }
        );

    }
}