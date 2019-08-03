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

  private languages = [ 'en', 'fr', 'jp'];


  /**
   * Generate the URL to download a file
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
  open(name: string, countryCode: string) : Promise<boolean>
  {
    var languageName = name + '_' + countryCode;
    return this.pdf.open(languageName)
    .then(
      _=>{
        return Promise.resolve(true);
      }
    )
    .catch(
      err=>{
        return Promise.reject(false);
      }
    )
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
     * download files described in a list
     * remark : download only latest files
     * @param list list of files (see list.json file)
     * @param countryCode language wanted (fr, en , jp)
     */
    downloadFilesFromList(list: any[], countryCode: string): Promise<Boolean>
    {
      if (list.length > 0 )
      {
        let me = this;
        var file = list.shift();
        return this.download(file.filename,countryCode).then(
          isDownloaded =>
          {
            if (isDownloaded == true)
            {
              console.log ("file " + file.filename + " [" + countryCode + "] downloaded");
              return me.downloadFilesFromList(list,countryCode);
            }
          }
        )
        .catch(err=>{return Promise.reject(err);})
      }
      // download finished
      else
      {
        return Promise.resolve(true); // fin de la fonction
      }
    }

    /**
     * Download documentation for all languages from a list
     * @param list 
     */ 
    downloadDocsFromList(fileList: any[], languageList: string[])
    {
      console.log("fileList = " + fileList.length + " elements");
      if (languageList.length > 0)
      {
        let fileListTemp = [...fileList]; // fileList cloned to fileListTemp
        let me = this;
        let language = languageList.shift();

        return me.downloadFilesFromList(fileListTemp,language)
        .then( 
          isDownloaded =>
          {
            if (isDownloaded == true)
            {
              console.log ("documentation pack [" + language + "] downloaded");
              return me.downloadDocsFromList(fileList,languageList);
            }
          } 
        )
        .catch(err=>{return Promise.reject(err);})
      }
      // download finished
      else
      {
        return Promise.resolve(true); // fin de la fonction
      }
    }


    /**
     * Open a pop up windows where user can confirm if he want (or not) 
     * to download the documentation for each language
     * @deprecated
     */
    async downloadLatestDocs()
    {
      let me = this;
      async function display(text){
        const alert = await me.alertController.create({
          header: text,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'OK',
              handler: () => {

                if (me.gen.isConnectedToInternet())
                {
                  me.gen.popupTemp("progress-docs", 600 * 1000);
                  me.launchDownloadLatestDocs()
                  .then(
                    result =>{
                      if (result == true)
                      {
                        console.log("downloadLatestDocs finished");
                        me.gen.dismiss();
                        me.gen.toastTemp("success-docs",2000);
                      }
                    }
                  )
                  .catch(
                    err=>{ 
                      console.log("downloadLatestDocs error", err);
                        me.gen.dismiss();
                        //me.gen.popupDebug("error : " + JSON.stringify(err));
                        me.gen.toastTemp("fail-docs",2000);
                    }
                  )
                }
                else{
                  me.gen.toastTemp("error-internet",2000);
                }
              }
            }
          ]
        });
        await alert.present();
      }

      this.gen.translateText('download-latest-docs').then
      (
        translatedText =>
        {
          display(translatedText);
        }
      )
    }


    launchDownloadLatestDocs() : Promise<any>
    {
      let me = this;
      var localList: any[] = null;
      var remoteList: any[] = null;

     // 1 - vérifier si le fichier list.json est présent en mémoire
      return me.getLocalList()
      .then(
        localListJson =>
        {
          localList = localListJson;

          // list.json existe dans le téléphone
          if (localList != null)
          {
            console.log("list.json exists. updating files...");
            return me.getRemoteList().then(
              remoteListJson =>
              {
                remoteList = remoteListJson;
                // comparer localList et remoteList pour garder uniquement les fichiers à DL
                var requiredList = me.compareLocalWithRemote(localList,remoteList);
                
                // On télécharge les fichiers manquants
                return me.downloadDocsFromList(requiredList, me.languages)
                .then(
                  result => { 
                    if (result == true){
                      console.log ("updated files downloaded !");
                      // On actualise la liste locale avec la liste remote
                      return me.saveRemoteListAsLocal().then(
                        result => { 
                          console.log ("local list.json downloaded !");
                          return Promise.resolve(true); // fin de la fonction
                        }
                      )
                      .catch(err=>{ return Promise.reject(err);})
                    }
                  }
                )
                .catch(err=>{ return Promise.reject(err);})
              }
            )
            .catch(err=>{ return Promise.reject(err);})
          }

          // list.json n'existe pas dans le téléphone
          else
          {
            console.log("list.json does not exist. downloading files...");
            // On actualise la liste locale avec la liste remote            
            return me.saveRemoteListAsLocal().then(
              result => {
                if (result == true)
                {
                  return me.getLocalList().then(
                    requiredList =>
                    {
                      console.log("remoteList = " + requiredList);
                      return me.downloadDocsFromList(requiredList, me.languages).then(
                        result => {
                          if (result == true)
                          {
                            return Promise.resolve(true); // fin de la fonction
                          }
                        }
                      )
                    }
                  )
                }
              }
            )
            .catch(
              err=>{
                return Promise.reject(err); // fin de la fonction
              }
            )
          }
        }
      )
    }

    /**
     * compare local list.json with remote list.json and return outdated files from local
     * @param localList local list.json
     * @param remoteList remote list.json
     * 
     * @return outdated or non-existent files in local list.json
     */
    compareLocalWithRemote(local: any[], remote: any[])
    {
      console.log("localList = " + local);
      console.log("remoteList = " + remote);
      var missingList;

      if (local.length > 0)
      {
        missingList = this.comparerList(local, remote);
      }
      else
      {
        missingList = [...remote];
      }
      console.log("missing "+ missingList.length + " elements in local list.json");
    
      return missingList;
    }

    
    comparerList(localList: any[] , remoteList : any[])
    {
      var missingList : any[] = [];
      var isDifferent: boolean = false;
      for (var i = 0; i < remoteList.length ; i++)
      {   
        isDifferent = true;
        // on compare l'élément i  avec chaque élément de localList
        for (var j = 0; j < localList.length ; j++)
        {
          // si au moins un élément comporte le même titre et la même version, alors l'élément est OK
          if (remoteList[i].filename === localList[j].filename && remoteList[i].version === localList[j].version)
          {
            isDifferent = false;
          }
        }
        // sinon , on le rajoute à la missingList
        if (isDifferent)
        {
          missingList.push(remoteList[i]);
        }
      }

      return missingList;
    }

    

    
    /**
     * download the remote list from github and save it in the phone memory
     */
    saveRemoteListAsLocal() : Promise<any>
    {
      var url = this.rawURL + 'list.json';
      let me = this;
      const fileTransfer: FileTransferObject = this.ft.create();

      return this.pdf.safeCreateDir(me.pdf.docPath, me.pdf.docDir)
      .then(
        _ => {
          return this.pdf.safeCheckFile(me.pdf.docFullPath , 'list.json')
          .then(
            _ =>
            {
            return fileTransfer.download(url,me.pdf.docFullPath + 'list.json')
            .then(
              file => 
                {
                  console.log('list.json downloaded',file);
                  return Promise.resolve(true);
                }
            )
            .catch(
              err =>
                {
                  console.log('error : list.json not downloaded',err);
                  return Promise.reject(err);
                }
              )
            }
          )
        }
      )
    }

    /**
     * get the content of the local list.json (or null if not found)
     */
    getLocalList() : Promise<any>
    {
      let me = this;
      return this.file.readAsText(me.pdf.docFullPath, 'list.json').then(
        content => 
        {
          let fileList = JSON.parse(content); 
          return Promise.resolve(fileList);
        })
        .catch(
          err =>
          {
            console.log('getLocalList : list does not exist',err);
            return Promise.resolve(null);
          }
        );
    }


    /**
     * get the content of the remote list.json (from github)
     */
    getRemoteList() : Promise<any>
    {
      let me = this;
      var url = this.rawURL + 'list.json';
      var tempDir = me.pdf.docFullPath + 'temp/';
      
      const fileTransfer: FileTransferObject = this.ft.create();

      return this.pdf.safeCreateDir(me.pdf.docPath, me.pdf.docDir)
      .then(
        _ => 
        {
          return this.pdf.safeCheckFile(tempDir , 'list.json')
          .then(
            _ =>
            {
              return fileTransfer.download(url, tempDir + 'list.json')
              .then(
                (entry) => 
                  {
                    console.log('list.json downloaded in temp/',entry);
                    return me.file.readAsText(tempDir, 'list.json').then(
                      content => 
                      {
                        let fileList = JSON.parse(content); 
                        return me.file.removeFile(tempDir, 'list.json').then
                        (
                          _=>{return Promise.resolve(fileList);}
                        )
                      })
                      .catch(
                        err =>
                        {
                          console.log('getRemoteList : list does not exist',err);
                          return Promise.resolve(null);
                        }
                      );
                  }
              )
              .catch(
                (err) =>
                  {
                    console.log('error : list.json not downloaded',err);
                    return Promise.reject(err);
                  }
              )
            }
          )
        }
      )
    }


    /**
     * check if new update is available or not
     * 
     * @return true if update available ; false otherwise
     */
    isUpdateAvailable() : Promise<boolean>
    {
      let me = this;
      var localList: any[] = null;
      var remoteList: any[] = null;

     // 1 - vérifier si le fichier list.json est présent en mémoire
      return me.getLocalList()
      .then(
        localListJson =>
        {
          localList = localListJson;

          // list.json existe dans le téléphone
          if (localList != null)
          {
            console.log("list.json exists. updating files...");
            return me.getRemoteList().then(
              remoteListJson =>
              {
                remoteList = remoteListJson;
                // comparer localList et remoteList pour garder uniquement les fichiers à DL
                var requiredList = me.compareLocalWithRemote(localList,remoteList);
                
                // On télécharge les fichiers manquants
                if (requiredList.length > 0 )
                {
                  return Promise.resolve(true); // fin de la fonction
                }
                else
                {
                  return Promise.resolve(false); // fin de la fonction
                }
              }
            )
            .catch(
              err =>{
                return Promise.reject(err);
              }
            )
          }

          // list.json n'existe pas dans le téléphone : mise à jour obligatoire
          else
          {
            return Promise.resolve(true); // fin de la fonction
          }
        }
      )
    }


    async eraseAllDocs()
    {
      let me = this;

      async function display(text){
        const alert = await me.alertController.create({
          header: text,
          buttons: [
            {
              text: 'No',
              role: 'cancel'
            }, {
              text: 'Yes',
              handler: () => {
                me.file.removeRecursively(me.pdf.docPath,me.pdf.docDir)
                .then(
                  _=>{
                    console.log("eraseAllDocs finished");
                    me.gen.dismiss();
                    me.gen.toastTemp("success-rm-docs",2000);
                  }
                )
                .catch(
                  _=>
                  {
                    console.log("eraseAllDocs finished");
                    me.gen.dismiss();
                    me.gen.toastTemp("success-rm-docs",2000);
                  }
                )
              }
            }
          ]
        });
        await alert.present();
      }
      
      this.gen.translateText('rm-all-docs').then
      (
        translatedText =>
        {
          display(translatedText);
        }
      )
    }
    
}



