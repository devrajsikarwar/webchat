import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { UserstatusProvider } from '../../providers/userstatus/userstatus';

/**
 * Generated class for the StatussliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statusslider',
  templateUrl: 'statusslider.html',
})
export class StatussliderPage {
  currentUser: any;
@ViewChild(Slides) slides : Slides
  constructor(public navCtrl: NavController, public navParams: NavParams, private statusservice : UserstatusProvider) {
    this.currentUser = this.statusservice.currentUserStatus;
    console.log(this.currentUser);
  }

  ionViewDidLoad() {
    this.slides.autoplay = 2000;
    this.slides.pager = true;
    
    console.log('ionViewDidLoad StatussliderPage');
  }

}
