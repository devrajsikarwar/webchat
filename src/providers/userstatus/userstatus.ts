import { Injectable } from '@angular/core';
import firebase from 'firebase'
import { AuthProvider } from '../auth/auth';
import { Events } from 'ionic-angular';

/*
  Generated class for the UserstatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserstatusProvider {
  
  firestatusData = firebase.database().ref('/userstatus');
  firfreindData = firebase.database().ref('/friends');
  firestore = firebase.storage();
  userStatus : any[];
  currentUserStatus: any;
  constructor(private authservice: AuthProvider,public events : Events) {
  }


  uploadStatus(url,type){
    var promise = new Promise((resolve,reject)=>{
      var byteString = atob(url.split(',')[1]);
    
      var ab = new ArrayBuffer(byteString.length);
    
      var ia = new Uint8Array(ab);
    
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
    
      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: type});
       var uuid = this.guid();
      var statusStore  = this.firestore.ref('/StatusStore').child(this.authservice.getUserDetails().uid).child('Status'+uuid);
      statusStore.put(blob).then(res=>{
        resolve(res.downloadURL);
      


      }).catch(err=>{
        reject(err);
      })

    })
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


  SaveStatus(mediaUrl){
    var promise = new Promise((resolve,reject)=>{
      this.firestatusData.child(this.authservice.getUserDetails().uid).push({
        statsUrl : mediaUrl,
        updatedAt : firebase.database.ServerValue.TIMESTAMP,
        viewedBy : []
      }).then(res=>{
        resolve(true);
      }).catch(err=>{
        reject(err);
      })
    });

    return promise;
  }


  getStatus(){
        let allmyfriends;
        var myfriends = [];
        let friendList : friend[] = [];
        let statusList :any[] =[];
        this.firfreindData.child(this.authservice.getUserDetails().uid).on('value', (snapshot) => {
          allmyfriends = snapshot.val();
          myfriends = [];
          for (var i in allmyfriends) {
            myfriends.push(allmyfriends[i].uid);
          }
          this.authservice.getAllUsers().then((res) => {
            var allusers = res;
            for (var j in myfriends)
              for (var key in allusers) {
                if (myfriends[j] === allusers[key].uid) {
                  debugger;
                  let newfriend = new friend();
                  newfriend.displayName = allusers[key].displayName;
                  newfriend.photoURL = allusers[key].photoURL;
                  newfriend.status = [];
                  newfriend.uid = allusers[key].uid;
                 friendList.push(newfriend);
                }
              }
            friendList.forEach((el)=>{
              debugger
              this.firestatusData.child(el.uid).once('value',(snap)=>{
                if(snap.val()!=null){
                  debugger;
                 for(var key in snap.val()){
                   el.status.push(snap.val()[key]);
                 }
    
                }
              })
            })

             this.userStatus = friendList;
             this.events.publish('getUserStatus');
          });           
      })
  }
}

export class friend{
  displayName : string;
  uid : string;
  photoURL : string;
  status : any[] ;
 }