import firebase from 'firebase';
import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { Events, Chip } from 'ionic-angular';


/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {
  
  

firereqData = firebase.database().ref('/request');
firfreindData = firebase.database().ref('/friends');

firegroupdetail = firebase.database().ref('/groups');

  userdetails: any[];
  friendList: any;
  allmygroups: groupdetail[];

  constructor(

    private afireAuth :AngularFireAuth,
    private auth : AuthProvider,
    private event :Events
  ) {
    console.log('Hello RequestProvider Provider');
  }

    
  sendReuest(request){
    var promise = new Promise((resolve,reject)=>{
      this.firereqData.child(request.receipent).push({
        sender : request.sender
      }).then(()=>{
        resolve(true);
      }).catch((err)=>{
          reject(err);
      })
    });
    return promise;
  }
  getAllrequests(){
   
    let allmyrequests;
    var myrequests = [];
    this.firereqData.child(this.auth.getUserDetails().uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.auth.getAllUsers().then((res) => {
        var allusers = res;
        this.userdetails = [];
        for (var j in myrequests)
          for (var key in allusers) {
            if (myrequests[j] === allusers[key].uid) {
              this.userdetails.push(allusers[key]);
            }
          }
          ;
        this.event.publish('gotrequests');
       
      })
       
  })
}
  getAllFriends(){
   
    let allmyfriends;
    var myfriends = [];
    this.firfreindData.child(this.auth.getUserDetails().uid).on('value', (snapshot) => {
      allmyfriends = snapshot.val();
      myfriends = [];
      for (var i in allmyfriends) {
        myfriends.push(allmyfriends[i].uid);
      }
      this.auth.getAllUsers().then((res) => {
        var allusers = res;
        this.friendList = [];
        for (var j in myfriends)
          for (var key in allusers) {
            if (myfriends[j] === allusers[key].uid) {
              this.friendList.push(allusers[key]);
            }
          }
          ;
        this.event.publish('gotfriends');
       
      })
       
  })
}




acceptrequest(sender): any {
  var promise = new Promise((resolve,reject)=>{
    this.firfreindData.child(this.auth.getUserDetails().uid).push({
      uid : sender.uid
    }).then(()=>{
  
      this.firfreindData.child(sender.uid).push({
        uid : this.auth.getUserDetails().uid
      }).then(()=>{
        this.rejectrequest(sender).then(()=>{
          resolve(true);
        }).catch((err)=>{
          reject(err);
        })

      }).catch((err)=>{
        reject(err);
      })

    }).catch((err)=>{
      reject(err);
    })
  });

  return promise;
}

rejectrequest(sender): any {
   var promise = new  Promise((resolve,reject)=>{
     this.firereqData.child(this.auth.getUserDetails().uid)
     .orderByChild('sender').equalTo(sender.uid).once('value',(data)=>{
       for(var key in data.val()){
          this.firereqData.child(this.auth.getUserDetails().uid).child(key).remove().then(()=>{
            resolve(true);
          }).catch((err)=>{
            reject(err);
          })
       }
   })
   })
   return promise;
}

createGroup(groupdetaiils): any {
  groupdetaiils.members.push(this.auth.getUserDetails());
    var promise = new Promise((resolve,reject)=>{
      this.firegroupdetail.child(groupdetaiils.groupname).push({
        groupIcon : groupdetaiils.groupIcon,
        owner : this.auth.getUserDetails().uid,
        members : groupdetaiils.members
      }).then(()=>{
        resolve(true);
      }).catch((err)=>{
          reject(err);
      });
    })
    return promise;
}


getMyGroups(): any {


  let groups : groupdetail[]=[];



  this.firegroupdetail.on('value',(data)=>{
        let groupnames:any[] = [];
         
        groupnames = Object.keys(data.val());

        groupnames.forEach(element => {
          this.firegroupdetail.child(element).once('value',(snap)=>{
            for(var k in snap.val()){
             let gdetail : groupdetail = {
               groupIcon :  snap.val()[k].groupIcon,
               members :  snap.val()[k].members,
               owner :  snap.val()[k].owner,
               groupname :  element
             }
            snap.val()[k].members.forEach(element => {
              if(element.uid == this.auth.getUserDetails().uid){
                groups.push(gdetail);
              }
            });
             
            }
          
          });
        });
        this.allmygroups = [];
       this.allmygroups = groups;
       this.event.publish('getMyGroups');
     })
}

}


export class groupdetail{
  groupname : string
  members : any[]
  owner : string
  groupIcon : string
}