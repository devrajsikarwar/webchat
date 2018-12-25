import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddgroupPage } from './addgroup';
import { GroupdetailmodalPageModule } from '../groupdetailmodal/groupdetailmodal.module';
import { GroupdetailmodalPage } from '../groupdetailmodal/groupdetailmodal';

@NgModule({
  declarations: [
    AddgroupPage,
    
  ],
  imports: [
    IonicPageModule.forChild(AddgroupPage),
    GroupdetailmodalPageModule
  ],
  
})
export class AddgroupPageModule {}
