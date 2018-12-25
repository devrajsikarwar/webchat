import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from "angularfire2";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NativeAudio } from '@ionic-native/native-audio';


import { AuthProvider } from '../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { RequestProvider } from '../providers/request/request';
import { Camera } from '@ionic-native/camera';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ChatProvider } from '../providers/chat/chat';
import { GroupProvider } from '../providers/group/group';

import { FileChooser } from '@ionic-native/file-chooser';
import { MediaCapture } from '@ionic-native/media-capture';
import { PhotoViewer  } from "@ionic-native/photo-viewer";
import { SuperTabsModule, SuperTabsController } from 'ionic2-super-tabs';
import { VideoPlayer } from '@ionic-native/video-player';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { HttpClientModule } from '@angular/common/http';
import { RtcProvider } from '../providers/rtc/rtc';
import { StatuscanvasPage } from '../pages/statuscanvas/statuscanvas';
import { StatuscanvasPageModule } from '../pages/statuscanvas/statuscanvas.module';
import { UserstatusProvider } from '../providers/userstatus/userstatus';


export var config = {
  apiKey: "AIzaSyD_ftJ5JFV2QRJOKHw4znoDCuojec96rYQ",
  authDomain: "webrtcionicapp.firebaseapp.com",
  databaseURL: "https://webrtcionicapp.firebaseio.com",
  projectId: "webrtcionicapp",
  storageBucket: "webrtcionicapp.appspot.com",
  messagingSenderId: "507427541024"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'}),
    AngularFireModule.initializeApp(config),
    SuperTabsModule,
    HttpClientModule,
    StatuscanvasPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StatuscanvasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AngularFireAuth,
    RequestProvider,
    Camera,
    WebView,
    ChatProvider,
    GroupProvider,
    FileChooser,
    MediaCapture,
    PhotoViewer,
    VideoPlayer,
   Network,
  LocalNotifications,
  FCM,
    RtcProvider,
    NativeAudio,
    UserstatusProvider
  ]
})
export class AppModule {}

