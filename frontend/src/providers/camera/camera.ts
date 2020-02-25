import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Injectable()
//@Component({})
export class CameraProvider {
    private image_data;
    private base64Image;

    constructor(
            //private cameraPreview: CameraPreview,
    private camera: Camera

      ) {
      }

      
      takePhoto(): Promise<any> { // funktio kuvan ottamiseen
    
        const options: CameraOptions = {  // kuvan asetukset
          quality: 80,  // laatu / skaalaus
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          targetHeight: 800, // haluttu korkeus ja leveys 1080??
          targetWidth: 800,
          allowEdit: true,
          saveToPhotoAlbum: false // tallennetaanko kuva puhelimeen, kuva nakyy galleriassa yms
          //cameraDirection: this.camera.Direction.BACK
        }
        return this.camera.getPicture(options).then(imageData => { // Varsinainen kuvan otto
          this.image_data = imageData;
          this.base64Image = "data:image/jpeg;base64," + imageData;   // tallentaa kuvan muuttujaan base64-muodossa (teksti muotoinen kuva) 
          // return this.image_data;
          return { paramPic: this.base64Image, paramData: this.image_data }; // siirtyy seuraavalle sivulle ja ottaa parametrina mukaan kuvan
          // console.log("Push done! camPage");
        }, (err) => {
          console.log("Error in photo taking");
          console.log(err);
        });
      }
}