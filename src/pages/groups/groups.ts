import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { RequestProvider, groupdetail } from '../../providers/request/request';
import { GroupProvider } from '../../providers/group/group';

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  mygroups: groupdetail[];
  
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private app :App,
    private reqservice : RequestProvider,
    public events : Events,
  public groupService : GroupProvider
  ) {
    this.events.subscribe('getMyGroups',()=>{
      this.mygroups = this.reqservice.allmygroups
    })
  }


  ionViewDidEnter(){
    this.reqservice.getMyGroups();

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }
  addGroup(){
    this.app.getRootNav().push('AddgroupPage');
  }
  groupchat(group){
    this.groupService.setGroup(group);
    this.app.getRootNav().push('GroupchatPage');
  }

}
