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

    docPath: string = this.file.dataDirectory;
    docDir:  string = "HackberryDoc";
    docFullPath: string  = this.docPath + this.docDir + "/";
    
    /**
     * download a pdf file from an url and save it in dataDirectory/pdf/
     * @param name name of the file
     * @param url url to download the file
     * @return true if download is successful ; false otherwise
     */
    download(name:string,url: string) : Promise <boolean>
    {
      let me = this;
      const fileTransfer: FileTransferObject = this.ft.create();

      return this.safeCreateDir(me.docPath, me.docDir)
      .then(
        // Directory exists, download the file and open it
        _ => 
        {
          return this.safeCheckFile(me.docFullPath , name + '.pdf')
          .then(
            _ =>
            {
              return fileTransfer.download(url,me.docFullPath + name + '.pdf')
              .then(
                (entry) => 
                  {
                    return Promise.resolve(true);
                  }
              )
              .catch(
                (err) =>{
                  console.log('error in file download',err);
                  return Promise.reject(err);
                }
              )
            }
          )
        }
      )  
    }

    /**
     * Open a PDF file from dataDirectory/pdf/
     * @param name 
     */
    open(name: string) : Promise<boolean> {
      if (this.platform.is('android')) 
      {
        return this.fileOpener.open(this.docFullPath + `${name}.pdf`, 'application/pdf')
        .then( _=> 
          {
            console.log('File is opened');
            return Promise.resolve(true);
          }
        )
        .catch(
          err =>
          {
            console.log('Error opening file ', err);
            return Promise.reject(false);
          }
        );
      } 
      else 
      {
        // Use Document viewer for iOS for a better UI
        const options: DocumentViewerOptions = {
          title: 'My PDF'
        }
        this.document.viewDocument(this.docFullPath + `${name}.pdf`, 'application/pdf', options);
        return Promise.resolve(true);
      }
    }

    /**
     * download a pdf file from an url, save it in dataDirectory/pdf/ and open it
     * @param name name of the file
     * @param url url to download the file
     * @deprecated
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
              console.log('error-download',entry);
              me.open(name);
              me.gen.dismiss();
            }
        )
        .catch(
          (err) =>{
            console.log('error in file download',err);
            me.gen.dismiss();
            me.gen.toastTemp("error-download", 2000);
          }
        )
      )
      .catch(
        // Directory does not exists, create a new one, then download and open the file
        err => 		
          me.file.createDir(me.docPath, me.docDir, false)
          .then(
            response => {
              me.openFromURL(name,url);
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
     * @deprecated
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
    

    safeCreateDir(path: string, dir : string) : Promise<boolean>
    {
      let me = this;
      return this.file.checkDir(path, dir)

      // Directory already exists, return true as Promise result
		  .then( _ => { return Promise.resolve(true);} )

      // Directory does not exists, create it
      .catch(
        err => 		
          me.file.createDir(me.docPath, me.docDir, false)
          .then( _ => { return me.safeCreateDir(path, dir); })
      );
    }

    safeCheckFile(path: string, file : string) : Promise<boolean>
    {
      let me = this;

      return this.file.checkFile(path, file)

      // File already exists, delete it
		  .then( _ => { 
        return me.file.removeFile(me.docPath, file)
          .then( _ => { return me.safeCheckFile(path, file); })
      })
      // File does not exist, return true as Promise result
      .catch( _ => { return Promise.resolve(true);} );	
    }


    
}