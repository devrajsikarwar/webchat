import { Injectable } from '@angular/core';
import firebase  from 'firebase'
import { groupdetail } from '../request/request';
import { AuthProvider } from '../auth/auth';
import { Events } from 'ionic-angular';
/*
  Generated class for the GroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupProvider {


  currentGroup: groupdetail;
  firegroupchat = firebase.database().ref('/groupchat');
  firegroupdetail = firebase.database().ref('/groups');
  allgroupmessages: messages[] = [];

  constructor(public auth : AuthProvider, private events : Events) {
    console.log('Hello GroupProvider Provider');
  }
  setGroup(group): any {
   this.currentGroup = group;
  }

  
  addmessage(message): any {
    var promise  = new Promise((resolve,reject)=>{
      this.currentGroup.members.forEach((member)=>{
        this.firegroupchat.child(this.currentGroup.groupname).child(member.uid).push({
          message: message,
          sender : this.auth.getUserDetails().uid
  
        }).then(()=>{

          this.auth.sendNotification(this.currentGroup.groupname,message,'group',this.currentGroup);

          resolve(true)
        }).catch((err)=>{
            reject(err);
        });
      });
      
    });

    return promise;
  }

  getmessages(): any {
       
    this.firegroupchat.child(this.currentGroup.groupname).child(this.auth.getUserDetails().uid).on('value',(data)=>{
      this.allgroupmessages = [];
      
      for(var key in data.val()){
        this.allgroupmessages.push(data.val()[key]);
      }

      this.currentGroup.members.forEach((member)=>{
        this.allgroupmessages.forEach((message:messages)=>{
          if(message.sender==member.uid){
            message.photoURL = member.photoURL;
            message.displayName = member.displayName
          }
        })
      })
    
    this.events.publish('getgroupmessages');
    })
  }

  addmembers(members){
    var promise = new Promise((resolve,reject)=>{
     
        this.firegroupdetail.child(this.currentGroup.groupname).once('value',data=>{
          this.firegroupdetail.child(this.currentGroup.groupname).child(Object.keys(data.val())[0]).child('members').update(members).then(()=>{
            resolve(true);
          }).catch((err)=>{
            reject(err);
          })
        })
      });
 

    return promise;
  }

}

export class messages {
  message :string;
  sender : string;
  photoURL : string;
  displayName : string;
}