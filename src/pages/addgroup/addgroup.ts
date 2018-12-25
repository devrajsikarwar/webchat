import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';

/**
 * Generated class for the AddgroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addgroup',
  templateUrl: 'addgroup.html',
})
export class AddgroupPage {
  myfriends = [];
  mushrooms ;
  groupIcon : string = 'data:image/png;base64,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'
  groupname :string;
  count =0;
  selectedFriend: any[]=[];
  constructor(public navCtrl: NavController, private actionSheet : ActionSheetController, 
    public navParams: NavParams, private reqservice : RequestProvider, private event : Events,
    public reqService : RequestProvider,
  ) {

  }
  
  ionViewWillEnter(){
    this.reqservice.getAllFriends();
    this.event.subscribe('gotfriends',()=>{
      this.myfriends =[];
      this.myfriends = this.reqservice.friendList;
     
    })
  }


  selectfriends(event,friend){
   if(event.checked==true){
    this.selectedFriend.push(friend);
   }
   else{
    this.selectedFriend.splice(this.selectedFriend.indexOf(friend.uid),1);

   }
   
   this.count = this.selectedFriend.length;
  }

  creategroup(){
    if(this.selectedFriend.length>0){
      let groupdetails = {
        groupname : this.groupname.trim(),
        members : this.selectedFriend,
        groupIcon : this.groupIcon,
      }
      console.log(groupdetails);
      this.reqservice.createGroup(groupdetails).then((res)=>{
        console.log(res)
      }).catch((err)=>{
        console.log(err);          
      })
    }
  }

  selectIcon(){
    let actionsheet = this.actionSheet.create({
      title : 'Select Group Icon',
      buttons : [
        {text : 'Open Camera', icon :'camera'},
        {text : 'Open Galary', icon :'images'},
        {text : 'Cancel', icon :'close', role:'close'}
      ],
      
    });

    actionsheet.present();
  }

  ionViewWillLeave(){
    this.event.unsubscribe('gotfriends');
  }
}
