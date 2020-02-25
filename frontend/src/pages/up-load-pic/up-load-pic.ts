import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Pictures } from '../../providers/pictures/pictures';
import { AlertController } from 'ionic-angular';
// import { CamPage } from '../cam/cam';
import { User} from '../../providers/user/user';

@Component({
  selector: 'page-up-load-pic',
  templateUrl: 'up-load-pic.html'
})
export class UpLoadPicPage {
  public uploading: boolean= false;
  myPhoto: any = "";
  parameterPic: string; // Parametrina saatava kuva, joka naytetaan sivulla
  myPhotosRef: any;
 // storageRef = firebase.storage().ref(); // firebas stroage referenssi
  data: any;
  fdate: string;
  fname: string;
  //pictures = [];
  Header: string = "What is this?";
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private user:User,
    //private http: Http,
    private Pictures: Pictures) { // navParams mahdollistaa tiedon siirron parametrina sivulta toiselle siirryttäessä
    this.parameterPic = this.navParams.get('paramPic'); // kuva parametrin maaritys
    this.myPhoto = this.navParams.get('paramData');
  //  this.myPhotosRef = firebase.storage().ref('/Photos/');
    this.parameterPic = "data:image/jpeg;base64," + this.myPhoto;
    this.data = null;
    this.generateFolderName();// pvm lyempään muotoon
    this.generateUUID(); // generoi random UUID pvm perusteella
    // this.uploadPhoto();
    if(!this.myPhoto)  this.undefImg();
  }



  // Tekee kansiolle nimen pvm mukaan esim: "2017-12-20"
  generateFolderName(): string {
    //var d: string;
    console.log("Push done! upload 2");
    var d = new Date().toISOString().split('T');
    this.fdate = d[0];
    return d[0];
  }

  // generoi randomin UUID:n pvm pohjalta
  generateUUID(): string {
    console.log("Push done! upload 3");
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    this.fname = uuid + ".jpeg";
    return uuid;
  }

  popView() {
  // this.getPhotoURL().then((url) => {
    this.uploading = true;
    this.Pictures.postPictures(this.fname, this.Header , this.parameterPic, this.fdate)
    .then((res)=>{
      console.log(res);
      this.navCtrl.popToRoot(); // palauttaa juuri näkymään
      this.uploading = false;
    });  
  // });
  }
  undefImg(){
    this.navCtrl.popToRoot(); // palauttaa juuri näkymään
    this.uploading = false;
    let alert = this.alertCtrl.create({
      title: 'Error...',
      subTitle: "Something went wrong with the picture process. If you were taking a photo, you should try again.",
      buttons: [
         {
          text: "OK",
          handler: () => {
            console.log('OK clicked');
          }

        }
      ]
    });
    alert.present();
  }

}
