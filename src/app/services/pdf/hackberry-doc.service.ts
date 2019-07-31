import { GeneralService } from 'src/app/services/general.service';
import { AlertController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/File/ngx';
import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';
import { strict } from 'assert';
import { stringify } from '@angular/compiler/src/util';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class HackberryDocService {

  
  constructor(
    private pdf : PdfService,
    private file: File, 
    private ft: FileTransfer ,
    private alertController: AlertController,
    private gen : GeneralService,
    ) { }

  private mainURL: string = "https://github.com/Thomas-Broussard/hackberry-docs/raw/master/";
  private rawURL: string = "https://raw.githubusercontent.com/Thomas-Broussard/hackberry-docs/master/";

  public docList;
  /**
   * Get the URL to download a file
   * @param name name of the file
   * @param countryCode language wanted (fr, en , jp)
   */
  getFileURL(name: string, countryCode: string)
  {
    return this.mainURL + countryCode + '/' + name + ".pdf";
  }

  /**
   * open a document from the phone memory
   * @param name name of the document to download
   * @param countryCode language wanted (fr, en , jp)
   */
  open(name: string, countryCode: string)
  {
    var languageName = name + '_' + countryCode;
    this.pdf.open(languageName);
  }

  /**
   * open (or download if needed) a document from the phone memory (or Hackberry Github)
   * @param name name of the document to download
   * @param countryCode language wanted (fr, en , jp)
   * @deprecated
   */
  openOrDownload(name: string, countryCode: string)
  {
    var url = this.getFileURL(name,countryCode);
    var languageName = name + '_' + countryCode;
    return this.pdf.openOrDownload(languageName,url);
  }

  
  /**
   * download a document from Hackberry Github
   * @param name name of the document to download
   * @param countryCode language wanted (fr, en , jp)
   */
  download(name: string, countryCode: string)
  {
    var url = this.getFileURL(name,countryCode);
    var languageName = name + '_' + countryCode;
    return this.pdf.download(languageName,url);
  }

    /**
     * download all pdf files from the repository and save it in dataDirectory/pdf/
     * @param url url to download the file
     */
    launchDownloadLanguagePack(countryCode : string)
    {
      var url = this.rawURL + 'list.json';
      let me = this;
      const fileTransfer: FileTransferObject = this.ft.create();

      return this.file.checkDir(me.pdf.docPath, me.pdf.docDir)
		  .then(
			// Directory exists, download the file and open it
        _ => 
        fileTransfer.download(url,me.pdf.docFullPath + 'list.json')
        .then(
          (entry) => 
            {
              console.log('list.json downloaded',entry);
              return me.downloadFilesFromList(countryCode)
              .then(
                result =>{ 
                  console.log("downloadFilesFromList Promise = " + result);
                  return result;
                }
              );
            }
        )
        .catch(
          (err) =>{
            console.log('error : list.json not downloaded',err);
            return false;
          }
        )
      )
      .catch(
        // Directory does not exists, create a new one, then relaunch the function
        err => 		
          me.file.createDir(me.pdf.docPath, me.pdf.docDir, false)
          .then(
            response => {
              console.log('Directory created',response);
                return me.launchDownloadLanguagePack(countryCode);
            }
          )
          .catch(
            err => {
              console.log('error : Could not create directory',err);
              return false;
            }
          ) 
      );
    }

    /**
     * download all files listed in list.json
     * @param countryCode language wanted (fr, en , jp)
     */
    downloadFilesFromList(countryCode: string)
    {
      this.gen.popupTemp("Downloading [" + countryCode + "] Documentation...", 600000);
      let me = this;
      console.log(me.pdf.docFullPath + "/" +  'list.json');

      // Read the file list.json
      return this.getFilesFromList()
      .then(
        fileList => 
        {
          console.log("getFilesFromList Promise  = " + fileList);
          return me.downloadList(fileList,countryCode)
          .then(
            result =>{
              console.log("downloadList Promise = " + result);
              return result;
            }
          );    
        }
      )
      .catch(
          err =>
          {
            console.log('errorDL : list does not exist',err);
            return false;
          }
        );
    }

    /**
     * get all the documents from the list.json as an array of objects
     */
    getFilesFromList()
    {
      let me = this;
      return this.file.readAsText(me.pdf.docFullPath, 'list.json').then(
        content => 
        {
          let fileList = JSON.parse(content); 
          //console.log("files : " + content); 
          me.docList = JSON.parse(content);
          return fileList;
        })
        .catch(
          err =>
          {
            console.log('errorGET : list does not exist',err);
            return [];
          }
        );
    }


    /**
     * download multiple files fromp a list.json
     * @param list list of files (see list.json file)
     * @param countryCode language wanted (fr, en , jp)
     */
    downloadList(list: any[], countryCode: string): Promise<Boolean>
    {
      if (list.length > 0 )
      {
        let me = this;
        var file = list.shift();
  
        return this.download(file.filename,countryCode).then(
          _=>{
            return me.downloadList(list,countryCode);
          }
        )
      }
      // download finished
      else
      {
        return Promise.resolve(true);
      }
    }


    /**
     * Open a pop up windows where user can confirm if he want (or not) to download the documentation
     * @param countryCode language wanted (fr, en , jp)
     */
    async downloadLanguagePack(countryCode: string, enablePopUp: boolean = false)
    {
      let me = this;
      let message = "Download the Documentation Pack [" + countryCode + "]? (internet required)";
      const alert = await this.alertController.create({
        header: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'OK',
            handler: () => {
              if (enablePopUp == true)
              {
                me.gen.popupTemp("Downloading Documentation Pack [" + countryCode + "]...", 600000);
              }
              me.launchDownloadLanguagePack(countryCode).then(
                result =>
                {
                  if(enablePopUp == true)
                  {
                    me.gen.dismiss();
                    me.gen.popupTemp("Documentation Pack [" + countryCode + "] successfully downloaded !", 2000);
                  }
                }
              ); 
            }
          }
        ]
      });
      await alert.present();
    }

    /**
     * Open a pop up windows where user can confirm if he want (or not) 
     * to download the documentation for each language
     */
    async downloadAllPack()
    {
      let me = this;
      let message = "Download the Documentation Pack for each language ? (internet required)";
      const alert = await this.alertController.create({
        header: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'OK',
            handler: () => {
              
              me.launchDownloadLanguagePack('fr').then(
                result =>{
                  if (result == true){
                    me.launchDownloadLanguagePack('en').then(
                      result =>{
                        if (result == true){
                          me.launchDownloadLanguagePack('jp').then(
                            result =>{
                              if (result == true){
                                me.gen.dismiss();
                                me.gen.toastTemp("Documentations successfully downloaded !",2000);
                              }
                            }
                          )
                        }
                      }
                    )
                  }
                }
              )

            }
          }
        ]
      });
      await alert.present();
    }
}



