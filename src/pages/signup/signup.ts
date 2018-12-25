import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, LoadingController, 
   ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  userform: any;
  loading: any;
  toastermessage: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private fb : FormBuilder,
     private loader : LoadingController,
      private auth: AuthProvider,
      private App : App, private toaster : ToastController) {
    this.userform = this.fb.group({
      username : [null,Validators.required],
      email : [null,Validators.required],
      password : [null,Validators.required]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  Login(){
    this.navCtrl.setRoot('LoginPage');
  }
   signup(){
    if(this.userform.valid){
    this.loading =   this.loader.create({
      content : 'Creating Your Account! Please Wait',
      
    });
    this.loading.present();
   this.auth.createUser(this.userform.value).then((res)=>{
     if(res==true){

       this.loading.dismiss();
       this.toastermessage =  this.toaster.create({
        message: "Account Created Successfully",
        duration:3000
      });
      this.toastermessage.present();
       this.App.getRootNav().push('LoginPage')
     }
   }).catch( (err)=>{
    this.toastermessage =  this.toaster.create({
      message: err.message,
      duration:3000
    });

    this.toastermessage.present();

    this.loading.dismiss();
  })
  }
}
}
