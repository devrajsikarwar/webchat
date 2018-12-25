import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, ActionSheet, ActionSheetController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import {Camera, CameraOptions} from '@ionic-native/camera';

import { LoginPage } from '../login/login';
import { WebView } from '@ionic-native/ionic-webview/ngx';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  currentUser: any;
  profilepic: any;

  constructor(
    public navParams: NavParams,
    private auth:AuthProvider, 
    private actionsheet : ActionSheetController,
    private camera :Camera,
    public webView :WebView,
    private navController : NavController,
    private app: App
  ) {
    this.loadProfile();
  }

  ionViewDidLoad() {

    
  }  
  loadProfile() {
    ;
    this.currentUser = this.auth.getUserDetails();
    this.profilepic = this.currentUser.photoURL;
  }

   editimage(){
    const getActionsheet =  this.actionsheet.create({
      title : 'Upload Photo',
      buttons :[
        {
          text : 'Take Photo',
          handler : ()=>{
            this.uploadpic(this.camera.PictureSourceType.CAMERA)
          } 
        },
        {
          text : 'Upload from Galary',
          handler : () =>{
            this.uploadpic(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        },
        {
          text : 'Cancel',
          role : 'Cancel'
        }
      ]
    });

     getActionsheet.present();

  }

  uploadpic(sourceType){
    let Options : CameraOptions  = {
      quality: 100,
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType : this.camera.EncodingType.JPEG,
      mediaType : this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType : sourceType
    }

    this.camera.getPicture(Options).then((imagePath)=>{
      this.profilepic = 'data:image/jpeg;base64,' + imagePath;
      
      this.auth.updateProfile(this.profilepic).then((res)=>{
        console.log(res);
      }).catch((err)=>{
        console.log(err);
      })
    console.log(this.profilepic)
    }).catch((err)=>{
      console.log(err);
    })
  }
  logout(){
    this.auth.logout();
   this.app.getRootNav().setRoot(LoginPage);
  }

}
