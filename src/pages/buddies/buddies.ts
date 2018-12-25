import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';

/**
 * Generated class for the BuddiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  filteredusers :any[] = [];
  temparr: any[]=[];
  currentUid: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authService : AuthProvider,
    private reqService :RequestProvider,

    private alertController : AlertController
  ) {
    this.currentUid = this.authService.getUserDetails().uid;
    
    authService.getAllUsersExceptFriends().then((res)=>{
    
      this.filteredusers = res;
      this.temparr = res;
    }).catch((err)=>{
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }
  searchuser(event){
    
    this.filteredusers = this.temparr;
    let q = event.target.value;
    if(q.trim()==""){
      return;
    }
    this.filteredusers = this.filteredusers.filter((x)=>{
      if(x.displayName.toLowerCase().indexOf(q.toLowerCase())>-1){
        return true;
      }
    return false;
    })
  }

  sendreq(receipent){
    this.reqService.sendReuest({sender : this.currentUid,receipent:receipent.uid}).then((res)=>{
      if(res==true){
        this.filteredusers = this.filteredusers.filter(a=>a.uid!=receipent.uid)
        let alert = this.alertController.create({
          title : 'Request Sent',
          subTitle : 'Request has send to '+receipent.displayName+' successfully',
          buttons : ['ok']
        });

        alert.present();
      }
    });   
}




}
