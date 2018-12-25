import { Injectable } from '@angular/core';
import firebase from 'firebase'
import { AuthProvider } from '../auth/auth';
import { Events, LoadingController } from 'ionic-angular';
import { FileChooser } from "@ionic-native/file-chooser";

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

 
  buddy: any;
  firebuddychatdata = firebase.database().ref('/buddychat');
  allmessages: any[];
  firestore = firebase.storage();
  setBuddy(item): any {
    this.buddy = item;
  }

  getBuddy(){
    let v = this.buddy;
    return v;
  }

  constructor(private authService : AuthProvider,
    public events : Events,
    private filechooser : FileChooser,
    private loadingCtrl : LoadingController
  ) {
    console.log('Hello ChatProvider Provider');
  }

  addmessage(message,type): any {
   var promise = new Promise((resolve,reject)=>{
    this.firebuddychatdata.child(this.authService.getUserDetails().uid).child(this.buddy.uid).push({
      sendby : this.authService.getUserDetails().uid,
      message : message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      type : type
    }).then(()=>{
      this.firebuddychatdata.child(this.buddy.uid).child(this.authService.getUserDetails().uid).push({
       sendby : this.authService.getUserDetails().uid,
       message : message,
       timestamp: firebase.database.ServerValue.TIMESTAMP,
       type : type
       
      }).then(()=>{
        this.authService.sendNotification(this.authService.getUserDetails().displayName, message,'chat', this.authService.getUserDetails());
        resolve(true)
      }).catch((err)=>{
        reject(err)
      })
    }).catch(err=>{
      reject(err);
    })
   });

   return promise;
  }

  getAllMessages(){

    this.firebuddychatdata.child(this.authService.getUserDetails().uid)
    .child(this.buddy.uid).on('value',(data)=>{
      this.allmessages = [];
      for(var key in data.val()){
        this.allmessages.push(data.val()[key]);
      }
      this.events.publish('getmessages');
    })
  }

  sendpics(nativeurl,type): any {
   var promise = new Promise((resolve,reject)=>{
     (<any>window).resolveLocalFileSystemURL(nativeurl,(res)=>{
       
       console.log(res)
       res.file((resFile)=>{
         
        var reader = new FileReader();
         reader.readAsArrayBuffer(resFile);

         reader.onload = (evt:any)=>{
           var imgBlob = new Blob([evt.target.result],{type:type});
            var uuid = this.guid();
            var imageStore = this.firestore.ref('/chatmultimediastore').child(this.authService.getUserDetails().uid).child('Image'+uuid);
            var uploadTask =     imageStore.put(imgBlob);

            let loader = this.loadingCtrl.create({
              content: "Sending File. Completed 0%",
              
        });
            loader.present();

            uploadTask.on('state_changed',function(snapshot){
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              loader.setContent("Sending File. Completed "+progress+"%");
            })
           uploadTask.then((res)=>{
             loader.dismiss(res);
               resolve(res.downloadURL)
          
          })
          .catch(err=>{
            reject(err);
          })
         }
       })
     },
    (err)=>{
      console.log(err);
    }
    )
   }
  
  )

   return promise;
  }
guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
  


}
