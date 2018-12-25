import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App, AlertController } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';

import { ChatProvider } from '../../providers/chat/chat';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myrequests: any[];
  displayAlert: any;
  myfriends: any[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public events : Events,
    private requestservice : RequestProvider,
    private app: App,
    private alert :AlertController,
    private chatService : ChatProvider,
    private santiser : DomSanitizer,
    private auth : AuthProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

  ionViewWillEnter(){
    this.requestservice.getAllrequests();
    this.requestservice.getAllFriends();
      this.events.subscribe('gotrequests',()=>{
       ;
        
       this.myrequests =[];
       this.myrequests= this.requestservice.userdetails;
     });
      this.events.subscribe('gotfriends',()=>{
       ;
        
       this.myfriends =[];
       this.myfriends= this.requestservice.friendList;
     });
  }

  addBuddy(){
    this.app.getRootNav().push('BuddiesPage');
  }
  accept(sender){
   this.requestservice.acceptrequest(sender).then((res)=>{
      if(res==true){
        this.showAlert('You Are now friend with '+sender.displayNme);
      }      
   }).catch((err)=>{
    this.showAlert(err.message);

   });
  }
  ignore(sender){
    this.requestservice.rejectrequest(sender).then((res)=>{
      if(res==true){
        this.showAlert('Request from '+sender.displayNme+ 'has deleted successfully');
      }
      
    }).catch(err=>{
      this.showAlert(err.message);
    });
  }

  showAlert(message){
    this.displayAlert =  this.alert.create({
      title : 'Alert!!!',
      subTitle : message,
      buttons :['Okey']
    });

    this.displayAlert.present();
  }

  chatWithFriend(item){
    console.log(item);
    this.chatService.setBuddy(item);
    this.app.getRootNav().push('ChatRoomPage');
  }
  ionViewWillLeave(){
    this.events.unsubscribe('gotfriends');
    this.events.unsubscribe('gotrequests');
  }


}
