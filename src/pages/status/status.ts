import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, Events,App } from 'ionic-angular';
import { StatuscanvasPage } from '../statuscanvas/statuscanvas';
import { UserstatusProvider } from '../../providers/userstatus/userstatus';
import { StatussliderPage } from '../statusslider/statusslider';

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {
  userStatus: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public app :App,
    public events : Events, private actionsheet : ActionSheetController, private modal : ModalController, private statusService: UserstatusProvider) {
  }

  ionViewWillEnter(){
    this.statusService.getStatus();
    this.events.subscribe('getUserStatus',()=>{
       
      this.userStatus =[];
      this.userStatus= this.statusService.userStatus;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
  }

  opensheet(){
    let sheet = this.actionsheet.create({
      buttons : [
        {text:'Open Camera', icon:'camera'},
        {text:'Upload Images', icon:'folder'},
        {text:'Record Video', icon:'videocam'},
        {text:'Upload video', icon:'folder'},
        {text:'Cancel', icon:'close', role :'close'}
      ],
      title : 'Add Status'
    });

    sheet.present();
  }
  openmodal(){
    let modalpopup = this.modal.create(StatuscanvasPage);
    modalpopup.present();
  }

  OnStatusTap(item){
    this.statusService.currentUserStatus = item;
    this.app.getRootNav().push('StatussliderPage');
  }

}
