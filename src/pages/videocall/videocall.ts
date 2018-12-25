import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RtcProvider } from '../../providers/rtc/rtc';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the VideocallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-videocall',
  templateUrl: 'videocall.html',
})
export class VideocallPage {
  calleeId: any;
  showAccept: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth : AuthProvider, private rtcProvider : RtcProvider,
  private nativeAudio : NativeAudio,
  private app: App
  ) {
  
if(this.rtcProvider.callType=="Incoming"){
  debugger;
  
    this.nativeAudio.loop('uniqueI1').then((succ)=>{
      console.log("succ",succ)
    }, (err)=>{
      console.log("err",err)
    });
  this.showAccept = true;
}
  
 if(this.rtcProvider.callType=="OutgoingCall")
  {
    debugger;
    this.calleeId = parseInt(this.rtcProvider.currtCalllee.replace(/[^0-9\.]/g, ''),10);
  }
   this.AddEventListner();
  }

  AddEventListner(): any {

    this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });

  


    this.rtcProvider.rtcapiRTC.addEventListener("userMediaSuccess", (e) => {
      debugger
    
     this.rtcProvider.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
       width: "100%",
       height: "50%"
     }, true);

   });

   this.rtcProvider.rtcapiRTC.addEventListener("userMediaError", (e) => {
    console.log("User Media error");
   });


   this.rtcProvider.rtcapiRTC.addEventListener("remoteStreamAdded", (e) => {
     debugger
     console.log("Remote Media Added Successfully")
    this.rtcProvider.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
      width: "100%",
      height: "50%"
    }, false);
  });


  this.rtcProvider.rtcapiRTC.addEventListener("hangup", (e) => {
    debugger;
    this.RemoveMediaElements(e.detail.callId);
   
    if (e.detail.lastEstablishedCall === true) {
      // this.app.getRootNav().pop();
    }
  });


 }



  ionViewDidLoad() {
    if(this.rtcProvider.callType=="OutgoingCall"){
   let callId = this.rtcProvider.webRTCClient.call(this.calleeId);
   if (callId != null) {
    this.rtcProvider.incomingCallId = callId;
   }


  }

  
  } 
  acceptCall(){
    this.rtcProvider.webRTCClient.acceptCall(this.rtcProvider.incomingCallId);
    this.showAccept = false;


    this.nativeAudio.stop('uniqueI1').then(()=>{},()=>{});
  }

  
  HangUp() {
    debugger;
    this.rtcProvider.webRTCClient.hangUp(this.rtcProvider.incomingCallId);
  }

  RemoveMediaElements(callId) {
    this.rtcProvider.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.rtcProvider.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }
}
