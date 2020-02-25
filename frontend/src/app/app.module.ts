import { MyApp } from './app.component';
import { TabsComponent } from '../components/tabs/tabs';
// Angular/ionic plugins
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { CameraPreview } from '@ionic-native/camera-preview';
import { IonicStorageModule } from "@ionic/storage";
import { GooglePlus } from '@ionic-native/google-plus';
import { JwtHelper } from "angular2-jwt";
import { Firebase } from '@ionic-native/firebase';
//import { ScreenOrientation } from '@ionic-native/screen-orientation';


// Pages:
//import { CommentFormPage } from '../pages/comment-form/comment-form'
//import { SignupPage } from '../pages/signup/signup';
import { CamPage } from '../pages/cam/cam';
import { FeediPage } from '../pages/feedi/feedi';
import { PicPage } from '../pages/pic/pic';
import { UpLoadPicPage } from '../pages/up-load-pic/up-load-pic';
import { MePage } from '../pages/me/me';
import { HomePage } from '../pages/home/home';
//import { SettingsPage } from './../pages/settings-page/settings-page';

// Providers
import { Pictures } from '../providers/pictures/pictures';
import { User } from '../providers/user/user';
import { CameraProvider } from '../providers/camera/camera';
import { Feedback } from '../providers/feedback/feedback';

//8.11.2017

@NgModule({
  declarations: [
    MyApp,
    CamPage,
    FeediPage,
    PicPage,
    UpLoadPicPage,
    MePage,
    HomePage,
    TabsComponent,
    //SettingsPage
    //SignupPage,
    //CommentFormPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CamPage,
    FeediPage,
    PicPage,
    UpLoadPicPage,
    MePage,
    TabsComponent,
    HomePage,
    //SettingsPage
    //SignupPage,
    //CommentFormPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Pictures,
    User,
    Camera,
    CameraPreview,
    // Login,
    Feedback,
    JwtHelper,
    GooglePlus,
    Firebase,
    CameraProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }