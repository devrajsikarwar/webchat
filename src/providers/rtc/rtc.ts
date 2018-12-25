import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { App } from 'ionic-angular';
declare var apiRTC: any;

/*
  Generated class for the RtcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RtcProvider {
  webRTCClient: any;
  rtcapiRTC: any;
  currtCalllee :any;
  incomingCallId: any;
  callType  : string;
  constructor(public auth : AuthProvider,private app:App) {
    
  }

  
  InitializeApiRTC(apiCCID:string){
    debugger;
    apiRTC.init({
      apiKey: "819abef1fde1c833e0601ec6dd4a8226",
      apiCCId : parseInt(apiCCID.replace(/[^0-9\.]/g, ''),10),
      onReady: (e) => {
        
       // 
        this.sessionReadyHandler(e);
      }
    });

  

  }

  sessionReadyHandler(arg0: any): any {
    console.log(apiRTC.session.apiCCId);
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeWebRTCClient() {
    debugger;
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    
  }

  AddEventListeners() {

    this.rtcapiRTC = apiRTC;


    apiRTC.addEventListener("incomingCall", (e) => {
      debugger;
      this.callType = "Incoming";
      this.app.getRootNav().push('VideocallPage');

       this.incomingCallId = e.detail.callId;
       
    });



    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);


    });

  }

  }


