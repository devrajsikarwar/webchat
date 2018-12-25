import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController,NavParams, IonicPage } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userform :FormGroup
  loading: any;
  toastermessage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private fb : FormBuilder,
    private loader : LoadingController,
    private toaster : ToastController,
    private authservice  : AuthProvider,

  ) {

    this.checkIsLogin()

    this.userform =  this.fb.group({
      email : [null,Validators.required],
      password : [null,Validators.required]
    })
  }


  checkIsLogin(){
    ;
    if(this.authservice.isLogin()){
      this.navCtrl.setRoot('TabsPage');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
  SignUp(){
    this.navCtrl.setRoot('SignupPage')
  }
  forgotPassword()
  {

  }
  signin(){
    if(this.userform.valid){
      this.loading =   this.loader.create({
          content : 'Authentiocating! Please Wait',
          
        });
        this.loading.present();
        
        this.authservice.login(this.userform.value).then((resp)=>{
          if(resp==true){  
            this.loading.dismiss();
            this.navCtrl.setRoot('TabsPage');
          }
        }).catch( (err)=>{
          this.toastermessage = this.toaster.create({
            message: err.message,
            duration:3000
          });
    
          this.toastermessage.present();
    
          this.loading.dismiss();
        })
      }
    }
  
}
