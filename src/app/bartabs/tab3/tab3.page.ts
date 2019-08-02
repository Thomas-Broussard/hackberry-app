import { AlertController, NavController } from '@ionic/angular';
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
    private gen : GeneralService,
    public navCtrl: NavController
    ) {}

    isUpdateAvailable : boolean = false;
  downloadRequired : boolean = false;
  countryCode : string = "en";
  docList: any = [];
  
  ngOnInit(){

  }

  ionViewWillEnter()
  {
    console.log("ionWillEnter");
    this.refreshDocs();
    this.checkUpdate();
  }
  
  /**
   * open the doc if present in memory (do not download them)
   */
  openDoc(name)
  {
    let me = this;
    this.gen.getLanguage().then(
      result => {
        me.countryCode = result;
        this.doc.open(name, me.countryCode).then().catch(
          err=>{
            console.log("error file not found ",err);
            this.gen.toastTemp("error-file-not-found", 2000);
          }
        ); 
      }
    )
  }

  /**
   * Check if documents need to be updated or not
   * 
   * @return true if update needed ; false otherwise
   */
  docNeedUpdate()
  {
    return this.isUpdateAvailable;
  }

  /**
   * Check if documents are found or not
   * 
   * @return true if  found ; false otherwise
   */
  noDocFound()
  {
    if (this.docList != undefined && this.docList != null) return this.docList.length <= 0;
    else return true;
  }

  /**
   * Download all the documents needed 
   */
  downloadAllDocs()
  {
    let me = this;
    me.doc.downloadLatestDocs();
  }

  /**
   * Refresh the documentation display
   */
  refreshDocs()
  {
    let me = this;
    this.gen.getLanguage().then(
      result => {
        me.countryCode = result;
        me.doc.getLocalList()
        .then(
          result => {
            me.docList = result;
          }
        );
      }
    );
  }

  checkUpdate()
  {
    let me = this;
    if (this.gen.isConnectedToInternet())
    {
      this.doc.isUpdateAvailable().then(
        result =>
        {
          me.isUpdateAvailable = result;
        }
      ).catch(
        err=>{
          me.isUpdateAvailable = false;
        }
      )
    }
    else{
      me.isUpdateAvailable = false;
    }
  }
}