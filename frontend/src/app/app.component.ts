import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController } from 'ionic-angular';
//import { TabsComponent } from '../components/tabs/tabs';
//import firebase from 'firebase'; 
import { FeediPage } from '../pages/feedi/feedi';
import { Pictures } from '../providers/pictures/pictures';
import { User } from '../providers/user/user'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = FeediPage; // määrittää feedi-sivun rootsivuksi
  
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public pictureService: Pictures,
    public user: User,
    public menuCtrl: MenuController
  ) {
    platform.ready().then(() => {
      statusBar.styleLightContent();
      splashScreen.hide();
    });
  }


}
