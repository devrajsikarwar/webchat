import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,  ActionSheetController, App, Events, Content } from 'ionic-angular';
import { groupdetail } from '../../providers/request/request';
import { GroupProvider } from '../../providers/group/group';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the GroupchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
  @ViewChild('groupcontent') groupcontent :Content

  currentgroup : groupdetail;
  currentuser : any;
  newmessage: string;
  groupmessage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
   public groupService :GroupProvider,
   public actionSheet : ActionSheetController,
   public app : App,
   public event : Events,
   public auth : AuthProvider
  ) {
    this.currentgroup = this.groupService.currentGroup;
    this.currentuser =
     this.auth.getUserDetails();
     this.scrollto();
     this.event.subscribe('getgroupmessages',()=>{
       this.groupmessage = this.groupService.allgroupmessages;
     });
  }

  ionViewDidEnter(){
    this.groupService.getmessages();
   
  }
  scrollto(){
    setTimeout(() => {
      this.groupcontent.scrollToBottom();
    }, 1000);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupchatPage');
  }
  opengroupAction(){
    let actionsheet = this.actionSheet.create({
      title : this.currentgroup.groupname,
      buttons : [
        {text : 'Group info', icon :'alert', handler : ()=>{
          this.app.getRootNav().push('GroupdetailmodalPage');
        }},
        {text : 'Add member', icon: 'person-add', handler : ()=>{
          this.app.getRootNav().push('GroupAddMemberPage')
        }},
        {text : 'Exit Group', icon : 'exit'},
        {text : 'Cancel', icon :'close', role:'close'}
      ]
    });

    actionsheet.present();
  }

  addmessage(){
  if(this.newmessage!=null && this.newmessage.trim()!=""){
    this.groupcontent.scrollToBottom();
    this.groupService.addmessage(this.newmessage).then((res)=>{
     this.newmessage = '';
    }).catch((err)=>{
      console.log(err);
    })
  }
  }
  ionViewWillLeave(){
    this.event.unsubscribe('getgroupmessages');
    
  }
  
}
