import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { SuperTabsModule, SuperTabsController } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    SuperTabsModule
  ],
  providers:[
    SuperTabsController
  ]
})
export class TabsPageModule {}
