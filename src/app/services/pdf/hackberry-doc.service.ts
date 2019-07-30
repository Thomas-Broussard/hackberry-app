import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/File/ngx';
import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';
import { strict } from 'assert';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class HackberryDocService {

  
  constructor(
    private pdf : PdfService,
    private file: File, 
    private ft: FileTransfer 
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


  /**
     * download all pdf files from the repository and save it in dataDirectory/pdf/
     * @param url url to download the file
     */
    downloadAll(countryCode : string)
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
              me.downloadFilesFromList(countryCode);
            }
        )
        .catch(
          (err) =>{
            console.log('error : list.json not downloaded',err);
          }
        )
      )
      .catch(
        // Directory does not exists, create a new one, then download and open the file
        err => 		
          me.file.createDir(me.pdf.docPath, me.pdf.docDir, false)
          .then(
            response => {
              console.log('Directory created',response);
              fileTransfer.download(url,me.pdf.docFullPath + 'list.json').then((entry) => 
              {
                  console.log('list.json downloaded',entry);
                  me.downloadFilesFromList(countryCode);
              })
              .catch((err) =>{
                  console.log('error : list.json not downloaded',err);
              });
            }
          )
          .catch(
            err => {
              console.log('error : Could not create directory',err);
            }
          ) 
      );
    }

    downloadFilesFromList(countryCode: string)
    {
      let me = this;
      console.log(me.pdf.docFullPath + "/" +  'list.json');
      return this.file.readAsText(me.pdf.docFullPath, 'list.json')
      .then(
        content => 
        {

          var fileList = JSON.parse(content);
          fileList.forEach(element => {
            me.download(element.filename,countryCode);
          });
          
          return fileList;
        })
        .catch(
          err =>
          {
            console.log('error : list does not exist',err);
            return [];
          }
        );
    }

    getFilesFromList()
    {
      let me = this;
      return this.file.readAsText(me.pdf.docFullPath, 'list.json').then(
        content => 
        {
          /* file list here */
          let fileList = JSON.parse(content); 
          console.log("files : " + content); 
          me.docList = fileList;
          
          return fileList;
        })
        .catch(
          err =>
          {
            console.log('error : list does not exist',err);
            return [];
          }
        );
    }
}



