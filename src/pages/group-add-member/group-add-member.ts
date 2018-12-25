import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { GroupProvider } from '../../providers/group/group';
import { RequestProvider } from '../../providers/request/request';

/**
 * Generated class for the GroupAddMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-add-member',
  templateUrl: 'group-add-member.html',
})
export class GroupAddMemberPage {
  friends: any[] = [];
  currentgroup: any;
  newmembers: any[] = [];
  selectedFriend : any[] = [];
  constructor(
    private app :App,
    public navCtrl: NavController, public navParams: NavParams, private groupservice : GroupProvider, private request : RequestProvider) {
  }

  ionViewWillEnter(){
    this.currentgroup = this.groupservice.currentGroup;
    this.friends = this.request.friendList;

    this.newmembers = this.friends.filter((element)=>{
      if(this.currentgroup.members.some(x=>x.uid==element.uid)){
        return false;
      }
      return true;
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupAddMemberPage');
  }
 selectfriends(event,friend){
   if(event.checked==true){
    this.selectedFriend.push(friend);
   }
   else{
    this.selectedFriend.splice(this.selectedFriend.indexOf(friend.uid),1);

   }
   
  
  }
  addmember(){
    this.selectedFriend.forEach(element=>{
      this.currentgroup.members.push(element)
    });
    this.groupservice.addmembers(this.currentgroup.members).then((res)=>{
      console.log(res);
      this.navCtrl.pop();
    }).catch((err)=>{
      console.log(err);
    })
  }
}
