import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,Content, ActionSheetController, App } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AuthProvider } from '../../providers/auth/auth';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { VideoPlayer } from '@ionic-native/video-player';
import { DomSanitizer} from '@angular/platform-browser';
import { RtcProvider } from '../../providers/rtc/rtc';


/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {

  @ViewChild('content') content :Content
  buddy :any ;
  newmessage : string="";
  allmessages: any[];
  photoURL: any;
  isItemSelected: boolean =false;
  selectedMessage: any[] = [];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private chatService : ChatProvider,
    public events : Events,
    private actionSheet : ActionSheetController,
    private authService : AuthProvider,
    private camera : Camera,
    private mediaCapture  :  MediaCapture,
    private imageViewer : PhotoViewer,
    private videoViewer : VideoPlayer,
    public sanitiser : DomSanitizer,
    private RTCProvider : RtcProvider,
    private App  : App
  ) {
    this.buddy = this.chatService.buddy;
  this.photoURL = this.authService.getUserDetails().photoURL;
  ;
  this.scrollto();

  this.events.subscribe('getmessages',()=>{

    this.allmessages = this.chatService.allmessages;
    console.log(this.allmessages);
  })
  }

  ionViewDidEnter(){
  this.chatService.getAllMessages();
   
  }
scrollto(){
  setTimeout(() => {
    this.content.scrollToBottom();
  }, 1000);
}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatRoomPage');
  }

  addmessage(){
    if(this.newmessage!=null && this.newmessage.trim()!=""){
      this.content.scrollToBottom();
      let message = this.newmessage.trim();
      this.chatService.addmessage(message,'text').then((res)=>{
        
        this.newmessage = ''
      })
    }
  }

  selectimagetosend(){
  let actionsheet = this.actionSheet.create({
    title : 'Select Image',
    buttons:[
      {text : 'Take Picture',icon:'camera', handler : ()=>{
        this.sendImage(true);
      }},
      {text : 'Select Image',icon:'folder',handler : ()=>{
        this.sendImage(false);
      }},
      {text : 'Take Video',icon:'videocam',handler : ()=>{
        this.sendVideo(true);
      }},
      {text : 'Select Video',icon:'folder',handler : ()=>{
        this.sendVideo(false);
      }},
      {text : 'Cancel',icon:'close'},
      
    ],
    
  });

  actionsheet.present();
  }

  ionViewWillLeave(){
    ;
    this.events.unsubscribe('getmessages');
  }
  // sendpics(){
  //   this.chatService.sendpics().then((res)=>{
  //     console.log(res);
  //   }).catch((err)=>{
  //     console.log(err);
  //   });
  // }

  sendImage(capture){
    if(capture==true){
      let options: CaptureImageOptions = {
        limit : 1
      
      }
      this.mediaCapture.captureImage(options).then(url=>{
  
        let mediaFile = url[0];
        this.sharemultimedia(mediaFile.fullPath,mediaFile.type)
      }).catch(err=>{
        console.log(err)
      })
    }
    else{
      let Options : CameraOptions  = {
        quality: 50,
        // destinationType : this.camera.DestinationType.NATIVE_URI,
        encodingType : this.camera.EncodingType.JPEG,
        mediaType : this.camera.MediaType.PICTURE,
        correctOrientation:true,
        
        sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
      }
      this.camera.getPicture(Options).then(url=>{
         this.sharemultimedia(url,'image/jpeg')
      }).catch(err=>{
        console.log(err)
      })
    }

  }

  sendVideo(capture){
     if(capture==true){
      let options : CaptureVideoOptions = {
        limit : 1,
        quality : 50
      }
      this.mediaCapture.captureVideo(options).then(url=>{
        ;
        let mediaFile = url[0];
        this.sharemultimedia(mediaFile.fullPath,mediaFile.type)
        console.log(url)
      }).catch(err=>{
        console.log(err)
      })
     }
     else{
      let Options : CameraOptions  = {
        quality: 50,
        
        mediaType : this.camera.MediaType.VIDEO,
        
        correctOrientation:true,
        sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
      }
      this.camera.getPicture(Options).then(url=>{
        console.log('file://'+url);
        this.sharemultimedia('file://'+url,'video/mp4');
        
      }).catch(err=>{
        console.log(err)
      })
     }
  }

  sharemultimedia(url, type) {
    ;
    this.chatService.sendpics(url,type).then((fileurl)=>{
      let messgtype;
      switch (type) {
        case 'image/jpeg':
          messgtype = 'image'
          break;
        case  'video/mp4' :
        messgtype = 'video'
        break;
        
      }
      this.chatService.addmessage(fileurl,messgtype).then((res)=>{
        this.newmessage = ''
      })
    })
    .catch(err=>{
      console.log(err);
    })
  }

  showmedia(url,user){
    this.imageViewer.show(url,user,{
      share: true,
      
    })
  }

  playVideo(url){
    this.videoViewer.play(url);
  }

  getSafeUrl(url) {
		return this.sanitiser.bypassSecurityTrustResourceUrl(url);		
  }
  
  pressItem(message){
   this.isItemSelected=  true;
   this.selectedMessage.push(message);
    console.log(this.selectedMessage);
  }

  selectItem(message){
    if(this.selectedMessage.length>0){
     
        console.log(this.selectedMessage.some((x)=>x==message))

    }
    else{
      return false;
    }
  }

  handleSelection(event){
    this.newmessage = this.newmessage + "" + event.char;
  }

  makevideocall(){
    debugger;
    this.RTCProvider.callType ="OutgoingCall"
    this.RTCProvider.currtCalllee = this.buddy.uid;
    this.navCtrl.push('VideocallPage');
  }

}

