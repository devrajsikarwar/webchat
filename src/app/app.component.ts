import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { ChatProvider } from '../providers/chat/chat';
import { GroupProvider } from '../providers/group/group';
import { RtcProvider } from '../providers/rtc/rtc';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private network: Network,
     private App : App, private FCM :FCM, private chatService : ChatProvider,private groupService : GroupProvider,
      private apiRtcProvider : RtcProvider, 
    ) {
    platform.ready().then(() => {         
      debugger;
     this.CheckNetworkSettings()  
      if(!platform.is('mobileweb')){     
         this.initializePushNotification();
      }
    });
    statusBar.styleDefault();
    splashScreen.hide();
  }
  CheckNetworkSettings(): any {
    if(this.network.type == this.network.Connection.NONE || this.network.type == this.network.Connection.UNKNOWN){
      this.rootPage = 'NoconnectionPage';
    }
    this.network.onConnect().subscribe(()=>{
        this.App.getRootNav().setRoot('LoginPage')
    })
    this.network.onDisconnect().subscribe(()=>{
      this.App.getRootNav().setRoot('NoconnectionPage')
     
    })
  }

  initializePushNotification(): any {
    this.FCM.subscribeToTopic('all');
    this.FCM.getToken().then(token=>{
      console.log(token);
    });

    this.FCM.onNotification().subscribe(data=>{
      console.log(data);
      if(data.wasTapped){
        console.log("Received in background");
         if(data.type=='group'){
          this.groupService.setGroup(data.info);
          this.App.getRootNav().push('GroupchatPage');
         }  
         else if(data.type="chat"){
          this.chatService.setBuddy(JSON.parse(data.info));
          this.App.getRootNav().push('ChatRoomPage');
         }
      }
      else{
        console.log("Received in foregroung");
      }
    });

    this.FCM.onTokenRefresh().subscribe(token=>{
      console.log(token);
    });

  }

}

