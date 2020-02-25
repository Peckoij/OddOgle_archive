//import { SettingsPage } from './../settings-page/settings-page';
//import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//import firebase from 'firebase';
import { PicPage } from '../../pages/pic/pic';
import { User } from '../../providers/user/user';
import { Pictures } from '../../providers/pictures/pictures';
//import { CameraPreview } from '@ionic-native/camera-preview';
//import { CamPage } from '../cam/cam';
import { MePage } from '../me/me';
//import { Platform } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera';
import { UpLoadPicPage } from '../../pages/up-load-pic/up-load-pic';
import { Firebase } from '@ionic-native/firebase';
//Melina kävi laittaa tännekin ton Http ja Pictures 7.11.2017
@Component({
  selector: 'page-feedi',
  templateUrl: 'feedi.html',

})
export class FeediPage {
  public spinState: String = 'first';

  // Melina sorkki tätä 7.11.2017
  constructor(
    public user: User,
    public navCtrl: NavController,
    public pictureService: Pictures,
    public modalCtrl: ModalController,
    //private platform: Platform,
    //private storage: Storage,
    public menuCtrl: MenuController,
    private camProvider: CameraProvider,
    private firebase: Firebase

  ) {
    //  this.user.googleLogout(); //kirjautuu ulos ja poistaa lokaalit käyttäjätiedot. tämä on testiä varten. 
    this.user.getLocalUserData();
    console.log("get userdata...");
    console.log(this.user.localUser);
    // Load newest feed, then start observing notifications,
    // if add was opened from notif, opens picture 
    this.pictureService.loadFeed().then(res=>{
      //*
      this.firebase.onNotificationOpen()
      .subscribe((notif) => {
        console.log("Notification opened");
        console.log(notif);
        this.notificationReceived(notif);
      }); //*/
    });
  }

  openMenu() {
    this.menuCtrl.open();
    //  this.user.googleLogout(); 
  }

    
  type: string = "default";
  
  reloadFeed(type) {
    this.type = type;
    console.log(this.type);
    this.pictureService.pictureList = [];
    this.pictureService.feedType = this.type;
    this.pictureService.loadFeed();
    this.menuCtrl.close();
  }

  logout() {
    this.user.googleLogout();
  //  this.menuCtrl.close();
  }

  login() {
    this.user.googleLogin();
   // this.menuCtrl.close();
  }



  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(true);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(false);
  }

  // Refresh feedPage
  doRefresh(refresher) {
    console.log("Refresh feed");
    this.pictureService.loadFeed();
    refresher.complete();
  }

  notificationReceived(data) {
    // if user tapped notification
    if (data.tap) {
      this.navCtrl.popToRoot();
      this.pictureService.getPicture(data.pic_id).then((picData) => {
        // check if pic is in current list
        var index = -1;
        for(var i=0; i<this.pictureService.pictureList.length;i++){
          if(this.pictureService.pictureList[i]._id===picData._id){
            index = i;
            i = this.pictureService.pictureList.length;
          }
        }
        console.log("Pic index: "+index);
        // if not in list add to some index (not first or last, so extend functions still wors as expected)
        if(index<0){
          console.log("Pic not in list, adding to position 1")
          this.pictureService.pictureList.splice(1,0,picData);
        }
        console.log("Pic loaded using notification data, tryion to open")
        console.log(picData);
        this.openPicPage(picData);
      });
    }
  }

  openPicPage(data) {
    console.log("pushing to picpage using:");
    console.log(data);
    this.navCtrl.push(PicPage, { paramData: data }); // avaa kommenttisivun kuvaa klikatessa
    //this.navCtrl.push(UpLoadPicPage, {paramPic: this.base64Image, paramData: this.image_data});
  }

  /*
  getPhotoURL(date: string, name: string) {  // Parametrina kuvan paivamaara, nimi ja elementin ID, ATM asettaa kuvan 'myimg' ID:llä varustettuun elementtiin
    var photoRef = this.storageRef.child('/Photos/' + date + '/' + name); // Kuvan sijainnin muodostaminen data-bucketissa
    photoRef.getDownloadURL().then(function (url) {  // Kuvan URL osoitteen haku/muodostus
      var img;
      img.setAttribute('src', url);
      return photoRef;
    });
  }
*/
  pushPage(name) {
    if (name === "feedi") {
      this.navCtrl.popToRoot();
    } else if (name === 'camera') {
      if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
        this.camProvider.takePhoto().then(res => {
          console.log("CAmera result:");
          console.log(res);
          if (res) this.navCtrl.push(UpLoadPicPage, res);
        });
      } else this.user.loginAlert();
    } else if (name === 'me') {
      if (this.user.localUser && this.user.localUser.data.userID != "Guest") {

        this.user.checkTokenValidity().then(res => {
          this.navCtrl.push(MePage);
        });
      } else { console.log("User invalid"); this.user.loginAlert(); }
    }

  }



} 