import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupAddMemberPage } from './group-add-member';

@NgModule({
  declarations: [
    GroupAddMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupAddMemberPage),
  ],
})
export class GroupAddMemberPageModule {}
