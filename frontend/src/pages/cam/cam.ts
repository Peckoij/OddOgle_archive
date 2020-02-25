import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UpLoadPicPage } from '../up-load-pic/up-load-pic';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Injectable } from '@angular/core';
// import { Crop } from 'ionic-native';


@Component({
  selector: 'page-cam',
  templateUrl: 'cam.html',
})
@Injectable()
export class CamPage {
  public base64Image: string;  // muuttuja kuvalle
  public image_data: any = null;
  public camOk: boolean = false;
  constructor(public navCtrl: NavController, private camera: Camera, private cameraPreview: CameraPreview) {
  }
  ionViewWillLeave() {
    this.closeCamera();
  }
  ionViewWillEnter() {
   this.openCamera();
  //this.takePhoto();
  }



// Camera Preview plugari: kameran käynntstys
  openCamera() {
    let cameraPreviewOpts: CameraPreviewOptions = {
      x: (window.screen.width / 2) - ((window.screen.width - 20) / 2),
      y: 65,
      width: window.screen.width - 20,
      height: window.screen.width - 20,
      camera: 'rear',
      tapPhoto: false,
      previewDrag: false,
      toBack: false,
      alpha: 1
    };

    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
    // this.cameraPreview.startCamera(cameraPreviewOpts);
    //this.cameraPreview.show();
    // this.cameraPreview.stopCamera();
  }

  // Camera Preview plugari: Kuvan otto
  // NOTE: atm plugari toimii vaihtelevasti eri laitteilla
  takePic() {
    let pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 720,
      quality: 85
    }

    this.cameraPreview.takePicture(pictureOpts).then((imageData) => { // Varsinainen kuvan otto
      this.image_data = imageData;
      console.log(imageData);
      //   this.closeCamera ()
      this.base64Image = "data:image/jpeg;base64," + imageData;   // tallentaa kuvan muuttujaan base64-muodossa (teksti muotoinen kuva) 
      //   console.log(this.base64Image);
      //   console.log(this.image_data);
      this.cameraPreview.hide();
      this.navCtrl.push(UpLoadPicPage, { paramPic: this.base64Image, paramData: this.image_data }); // siirtyy seuraavalle sivulle ja ottaa parametrina mukaan kuvan  
    }, (err) => {
      console.log(err);
    });

  }
  pushPage() {
    let tBase64Image = " ";
    let tImage_Data = " ";
    this.closeCamera()
    this.navCtrl.push(UpLoadPicPage, { paramPic: tBase64Image, paramData: tImage_Data });
  }

  // Camera Preview plugari: kameran sammutus
  closeCamera() {
    this.cameraPreview.stopCamera().then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
  }

  // Native Camera: kameran avaus ja kuvan otto
  takePhoto() { // funktio kuvan ottamiseen
    const options: CameraOptions = {  // kuvan asetukset
      quality: 100,  // laatu / skaalaus
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1280, // haluttu korkeus ja leveys
      targetWidth: 1280,
      allowEdit:true,
      saveToPhotoAlbum: true // tallennetaanko kuva puhelimeen, kuva nakyy galleriassa yms
      // cameraDirection: this.camera.Direction.BACK
    }
    this.camera.getPicture(options).then(imageData => { // Varsinainen kuvan otto
      this.image_data = imageData;
      this.base64Image = "data:image/jpeg;base64," + imageData;   // tallentaa kuvan muuttujaan base64-muodossa (teksti muotoinen kuva) 
      this.navCtrl.push(UpLoadPicPage, { paramPic: this.base64Image, paramData: this.image_data }); // siirtyy seuraavalle sivulle ja ottaa parametrina mukaan kuvan
     // console.log("Push done! camPage");
    }, (err) => {
      console.log(err);
    });
  }

}
