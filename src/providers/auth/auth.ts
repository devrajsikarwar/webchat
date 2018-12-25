import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import {  Events } from 'ionic-angular';

@Injectable()
export class AuthProvider {


firedata = firebase.database().ref('/chatusers');
firereqdata = firebase.database().ref('/request');
firefrienddata = firebase.database().ref('/friends');
  constructor(public afireauth : AngularFireAuth,
    private event :Events,
  private http :  HttpClient
  ) { }


  login(credentials) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
          this.firedata.child(this.afireauth.auth.currentUser.displayName).once('value',(data)=>{
            let usercrecords = {
              displayName :data.val().displayName,
              photoURL : data.val().photoURL,
              email :  data.val().email,
              uid :  data.val().uid
            }
            localStorage.setItem('userrecord',JSON.stringify(usercrecords));
           resolve(true);
          })
      
      }).catch((err) => {
        reject(err);
       })
    });

    return promise;

  }

  createUser(credentials){
    var promise = new Promise((resolve,reject)=>{
      this.afireauth.auth.createUserWithEmailAndPassword(credentials.email,credentials.password).then(()=>{
        this.afireauth.auth.currentUser.updateProfile({displayName:credentials.username,photoURL:""})
        .then(()=>{
         this.firedata.child(this.afireauth.auth.currentUser.displayName).set({
          uid: this.afireauth.auth.currentUser.uid,
          displayName: credentials.username,
          photoURL: '',
          
         })
         .then(()=>{
           resolve(true);
          })
          .catch((err)=>{
            reject(err);
          })
        })
        .catch((error)=>{
          reject(error);
        })
      })
      .catch((error)=>{
        reject(error);
      })
    })
    return promise;
  }

  sendPasswordResetLink(email){
    return new Promise((resolve,reject)=>{
      this.afireauth.auth.sendPasswordResetEmail(email).then(()=>{
        resolve(true);
      })
      .catch((err)=>{
        reject(err);
      })
    })
  }
  public getUserDetails() {
;
   let userprofile = JSON.parse(localStorage.getItem("userrecord"))

    return userprofile;
  }

  logout(): any {
     firebase.auth().signOut().then(()=>{
       localStorage.clear();
      
     });
  }

    isLogin(){
      if(this.getUserDetails()!=null){
        return true;
      }
     return false;
      }  


  getAllUsersExceptFriends(): any {
    var users = [];
    var friends =[];
     var promise = new Promise((resolve,reject)=>{
       this.firedata.orderByChild('uid').once('value',(data)=>{
          users = data.val();
        
         let temparr =[];
         for(var key in users){
          this.firereqdata.child(users[key].uid).on('value',(reqdata)=>{
             if(reqdata.val()!=null){
               ;
               for(var req in reqdata.val()){
                 if(reqdata.val()[req].sender == this.getUserDetails().uid){
                  friends.push({displayName:users[key].displayName})

                 }
               }
             }
          });
          this.firefrienddata.child(this.getUserDetails().uid).once('value',(data)=>{
         for(var element in data.val())
              if(data.val()[element].uid == users[key].uid){
                friends.push({displayName:users[key].displayName})
              }
          
          })


           temparr.push(users[key]);

         }
         for(var x in friends){
           ;
           temparr = temparr.filter(a=>a.displayName!=friends[x].displayName);
         }
          

        
         resolve(temparr);
       }).catch((err)=>{
         reject(err);
       });
     })
     return promise;
  }
  getAllUsers(): any {
    var users = [];
 
     var promise = new Promise((resolve,reject)=>{
       this.firedata.orderByChild('uid').once('value',(data)=>{
          users = data.val();
         
         let temparr =[];
         for(var key in users){
        
    
           temparr.push(users[key]);

         }
     this.event.publish('gotbuddies');
        
         resolve(temparr);
       }).catch((err)=>{
         reject(err);
       });
     })
     return promise;
  }

  updateProfile(photoURL){
   var promise = new  Promise((resolve,reject)=>{
    this.firedata.child(this.getUserDetails().displayName).child('photoURL').set(photoURL).then((res)=>{
      let usercrecords = this.getUserDetails();
      usercrecords.photoURL = photoURL;
      this.updateLocalRecords(JSON.stringify(usercrecords));
      resolve(res);
     
    }).catch((err)=>{
      reject(err);
    })
   })

   return promise;
  }

  updateLocalRecords(userrecord){
    localStorage.setItem('userrecord',userrecord)
  }


  sendNotification(title, message, type, info) {  
    ;
let body = {
  'registration_ids': ['fR2AxYsa-pc:APA91bEVH2K92Y-oXXJWDhB7aE6jDXLSm7AgqHCoB3_1CucQD7TLpLyOdBV0dAY-o70X-xAojH8gwQgYwU8t7TE3df7vCLAFzUCh0U_9Vw88v71XMYrj4RgGMzI7eyP_m_z4AKM46IFO'],
    "notification":{
      "title":title,
      "body":message,
      "sound":"default",
      "click_action":"FCM_PLUGIN_ACTIVITY",
      "icon":"ic_notification"
    },
    "data":{
      "info":info,
      "type":type
    },
    
      "priority":"high",
      "restricted_package_name":""
  }
  let options = new HttpHeaders().set('Content-Type','application/json');
  this.http.post("https://fcm.googleapis.com/fcm/send",body,{
    headers: options.set('Authorization', 'key=AAAAdiUJ0CA:APA91bFBgGAxKYP0QBdkpTYVWOU7y0dhQ5y-T2oyVh-GyAxSvBJPLpP1GBeUNlLsGkMzKbe3Bd-lWfHC8BzlOS5jbYdXWLVtIjFjVO6X_xEbFnsTUvejeLuGX6sGKTiMzp1DH4aEh4j4'),
  })
    .subscribe();
}

}
