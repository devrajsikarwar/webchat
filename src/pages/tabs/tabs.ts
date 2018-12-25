import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RtcProvider } from '../../providers/rtc/rtc';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1: string = "ChatsPage";
  tab2: string = "GroupsPage";
  tab3: string = "ProfilePage";
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiRtcProvider : RtcProvider,private auth :AuthProvider) {
   
    apiRtcProvider.InitializeApiRTC(this.auth.getUserDetails().uid);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
