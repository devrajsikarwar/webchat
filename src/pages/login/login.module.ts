import { NgModule } from '@angular/core';
import { IonicPageModule, NavController } from 'ionic-angular';
import { LoginPage } from './login';


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
