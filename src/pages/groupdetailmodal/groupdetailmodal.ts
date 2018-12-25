import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupProvider } from '../../providers/group/group';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the GroupdetailmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupdetailmodal',
  templateUrl: 'groupdetailmodal.html',
})
export class GroupdetailmodalPage {
  currentGroup : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public groupservice : GroupProvider,
  public auth : AuthProvider
  ) {

    this.currentGroup = this.groupservice.currentGroup;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupdetailmodalPage');
  }

}
