import { CameraOptions, Camera } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from '../../providers/user/user';
// Melina kävi laittaa observarble, map ja Http
import { Pictures } from '../../providers/pictures/pictures';
import { AlertController } from 'ionic-angular';
import { UpLoadPicPage } from '../up-load-pic/up-load-pic';
import { MePage } from '../me/me';
import { CommentFormPage } from '../comment-form/comment-form'
//import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'page-pic',
  templateUrl: 'pic.html'
})
export class PicPage {
  //localData: any;
  //localArray: [any];
  curIndex: number;
  sendComment: any = "";
  id: string;
  picture: any;
  loaded: boolean = false;
  picScore: number = 0;
  comScore: number = 0;
  placeHolder: String = 'Write something nice';
  //data : any;

  //comments: Observable<any>;

  constructor(

    private camera: Camera,
    public navCtrl: NavController,
    public http: Http,
    // public pictures: Pictures,
    public navParams: NavParams,
    private pictures: Pictures,
    public alertCtrl: AlertController,
    private user: User,
    private popoverCtrl: PopoverController,
    // public slides:Slides
  ) {
    // ATM KUVA base64 muodossa kuva objection 'name' attribuutissa
    this.picture = this.navParams.get('paramData');
    //this.localArray = this.navParams.get('paramArray');
    this.curIndex = -1;
        for(var i=0; i<this.pictures.pictureList.length;i++){
          if(this.pictures.pictureList[i]._id===this.picture._id){
            this.curIndex = i;
            i = this.pictures.pictureList.length;
          }
        }
        
    console.log(this.pictures.pictureList[this.curIndex]);
    //this.localData = this.pictures.pictureList[this.curIndex];
    //this.picture = this.pictures.pictureList[this.curIndex];
    //this.data = null; localArray[curIndex] pictures.pictureList[curIndex]
    this.loaded = true;
  }
  ionViewDidLoad() {
    console.log("kuvasivu ladattu");
  }

  ionViewWillEnter() {
    this.loaded = false;
    this.loadContent(this.pictures.pictureList[this.curIndex]._id);
  }
  // kuvien välillä swaippaus
  swipeEvent(e) {
    var index = 0;
    if (e.direction === 2) {
      index = this.curIndex + 1;
      // jos taulusta loppuu kuvat sitä jatketaan,haetaan lisää kuvia
      if (index >= this.pictures.pictureList.length) {
        this.pictures.extendPictures().then((data) => {
          // jos index menee yli taulun pituuden ja vanhempia kuvia ei löydy, indeksi asetetaan nollaksi
          if (index >= this.pictures.pictureList.length) {
            index = 0;
            console.log("No older pictures available, jump to newest pic")
          }
          //this.picture = this.pictures.pictureList[index];
          this.curIndex = index;
          this.loadContent(this.pictures.pictureList[this.curIndex]._id);
        });
      } else {
        this.curIndex = index;
        this.loadContent(this.pictures.pictureList[this.curIndex]._id);
      }
    }
    if (e.direction === 4) {
      index = this.curIndex - 1;
      // jos index menee alle nollan asetetaan taulun viimeiseen
      if (index < 0) index = 0;//this.pictures.pictureList.length - 1; 
      // this.picture = this.pictures.pictureList[index];
      this.curIndex = index;
      this.loadContent(this.pictures.pictureList[this.curIndex]._id);
    }
    /*
    var index=0;
    if (e.direction == 2) {
      index = this.curIndex+1;
      if(index>=this.localArray.length) index=0;
      this.navCtrl.push(PicPage, { paramData: this.localArray[index], paramArray: this.localArray });
    }
    if (e.direction == 4) {
      index = this.curIndex-1;
      if(index<0) index=this.localArray.length-1;
      this.navCtrl.push(PicPage, { paramData: this.localArray[index], paramArray: this.localArray });
    }
    */
  }

  loadContent(id) {
    //this.loaded = false;
    // hae data tietokannasta avatulle kuvalle
    this.pictures.getPicture(id).then((dataLocal) => {
      dataLocal.name= this.pictures.pictureList[this.curIndex].name;
      console.log(dataLocal);
      this.pictures.pictureList[this.curIndex] = dataLocal;
      this.calcPicScore();
      console.log(this.pictures.pictureList[this.curIndex].comments.length);
      this.handleContent();

    });
  }

  handleContent() {

    //Käsittele data: laske scoret ja tarkista mitä käyttäjä on jo äänestänyt
    for (var i = 0; i < this.pictures.pictureList[this.curIndex].comments.length; i++) {
      // Laskee total score commentille ja tallenna se 
      //console.log('laske score kommentille ' + i);
      this.calcComScore(this.pictures.pictureList[this.curIndex].comments[i].upvotes, this.pictures.pictureList[this.curIndex].comments[i].downvotes);
      this.pictures.pictureList[this.curIndex].comments[i].score = this.comScore;
      // anna "vakio" arvoksi äänestämiselle ei äänestänyt
      this.pictures.pictureList[this.curIndex].comments[i].hasVotedUp = false;
      this.pictures.pictureList[this.curIndex].comments[i].hasVotedDown = false;
      // tarkista löytyykö nimi upvoters listasta
      for (var u = 0; u < this.pictures.pictureList[this.curIndex].comments[i].upvoters.length; u++) {
        if (this.user.localUser.data.userID === this.pictures.pictureList[this.curIndex].comments[i].upvoters[u]) {
          this.pictures.pictureList[this.curIndex].comments[i].hasVotedUp = true;
        }
      }
      // jos .hasVoteUp edelleen false tarkista downvoters lista, jos jo äänestänyt ei tarvetta tarkistaa
      if (!this.pictures.pictureList[this.curIndex].comments[i].hasVotedUp) {
        // console.log("tarkista downvoters commenttisas");
        for (var y = 0; y < this.pictures.pictureList[this.curIndex].comments[i].downvoters.length; y++) {
          if (this.user.localUser.data.userID === this.pictures.pictureList[this.curIndex].comments[i].downvoters[y]) {
            this.pictures.pictureList[this.curIndex].comments[i].hasVotedDown = true;
          }
        }
      }
      //console.log("User has voted comment " + i + " ? " + this.picture.comments[i].hasVoted);
    }
    // laske score kuvalle
    // upvoters lista:
    this.pictures.pictureList[this.curIndex].hasVotedUp = false; // default false
    this.pictures.pictureList[this.curIndex].hasVotedDown = false; // default false
    // tarkista onko käyttäjä jo äänestänyt kuvaa
    if (!this.pictures.pictureList[this.curIndex].hasVotedUp) {
      for (var pi = 0; pi < this.pictures.pictureList[this.curIndex].upvoters.length; pi++) {
        if (this.user.localUser.data.userID === this.pictures.pictureList[this.curIndex].upvoters[pi]) {
          this.pictures.pictureList[this.curIndex].hasVotedUp = true;
        }
      }
    }
    if (!this.pictures.pictureList[this.curIndex].hasVotedDown) {  // ja downvoters
      for (var py = 0; py < this.pictures.pictureList[this.curIndex].downvoters.length; py++) {
        if (this.user.localUser.data.userID === this.pictures.pictureList[this.curIndex].downvoters[py]) {
          this.pictures.pictureList[this.curIndex].hasVotedDown = true;
        }
      }
    }
    //console.log("User has voted picture ? " + this.pictures.pictureList[this.curIndex].hasVoted);
    // Lataa html kun kaikki data haettu ja käsitelty
    //console.log(this.pictures.pictureList[this.curIndex]);
    this.loaded = true;
    console.log(this.pictures.pictureList[this.curIndex]);
  }

  presentCommentForm() {
    let popover = this.popoverCtrl.create(CommentFormPage, { pId: this.pictures.pictureList[this.curIndex]._id }, { cssClass: 'commentPopover', showBackdrop: true, enableBackdropDismiss: false });
    popover.present();  // kommentointi ikkunan näyttö
    popover.onDidDismiss(() => {
      this.loadContent(this.pictures.pictureList[this.curIndex]._id);
    });
  }

  showReportAlert() {
    let prompt = this.alertCtrl.create({
      title: 'Reason to snitch:', // Why the hatred?, Reason to snitch:
      inputs: [
        {
          type: 'radio',
          label: 'Unwanted shapes or nudity', // alastomuus
          value: 'Unwanted shapes or nudity'  // Unwanted shapes or nudity, Too much skin
        },
        {
          type: 'radio',
          label: "Personal information",  // henkilö tietoja
          value: 'Personal information'   // Too much information, Personal information
        },
        {
          type: 'radio',
          label: "It's MEAN", // kiusaaminen / syrjintä
          value: 'Its MEAN'
        },
        {
          type: 'radio',
          label: "This must be illegal", // laiton sisältö
          value: 'Illegal content'
        },
        {
          type: 'radio',
          label: "Just for fun", // ei syytä
          value: 'No reason'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Snitch',
          handler: data => {
            this.trashPic(data);
            return true;
          }
        }
      ]
    });
    prompt.present();
  }


  calcPicScore() {
    console.log("laske score kuvalle");
    var up: number = this.pictures.pictureList[this.curIndex].upvotes;
    var down: number = this.pictures.pictureList[this.curIndex].downvotes;
    if (!up) up = 0;
    if (!down) down = 0;
    var sum: number;
    sum = up - down;
    this.pictures.pictureList[this.curIndex].score = sum;
    // console.log(sum);
  }

  calcComScore(up, down) {
    //  console.log("laske score kommentille");
    // var up: number = this.picture.comments[0].upvotes;
    //var down: number = this.picture.comments[0].downvotes;
    if (!up) up = 0;
    if (!down) down = 0;
    var sum: number;
    sum = up - down;
    this.comScore = sum;
    return sum;
  }


  votePicture(ud) {
    if (this.user.localUser && this.user.localUser.data.userID != "Guest") {

      console.log('trying to vote picture');
      var reVoter = false;
      if (this.pictures.pictureList[this.curIndex].hasVotedDown || this.pictures.pictureList[this.curIndex].hasVotedUp) {
        reVoter = true;
      }
      this.pictures.pictureList[this.curIndex].hasVotedDown = true;
      this.pictures.pictureList[this.curIndex].hasVotedUp = true;
      this.pictures.votePic(this.pictures.pictureList[this.curIndex]._id, ud, reVoter).then(res => {
        console.log(res);
        console.log("äänestys onnistui");
        this.loadContent(this.pictures.pictureList[this.curIndex]._id);
      });
    } else this.user.loginAlert();
  }

  voteComment(ud, _id, comIndex) {
    if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
      var reVoter = false;
      if (this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedDown || this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedUp) {
        reVoter = true;
      }
      console.log(comIndex);
      this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedUp = true;
      this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedDown = true;
      this.pictures.voteCom(_id, ud, this.pictures.pictureList[this.curIndex]._id, reVoter).then(res => {
        console.log(res);
        console.log("äänestys onnistui");
        this.loadContent(this.pictures.pictureList[this.curIndex]._id);
      });
    } else this.user.loginAlert();
  }

  trashPic(reasonToHate) {
    if (!reasonToHate) {
      reasonToHate = "No reason";
    }
    // var index;
    console.log('picture reported');
    this.pictures.trashPic(this.pictures.pictureList[this.curIndex]._id, this.user.localUser.data.userID, reasonToHate).then(res => {
      console.log(res);
      console.log("report success");
      console.log(this.pictures.pictureList);
      this.pictures.pictureList.splice(this.curIndex, 1);
      console.log(this.pictures.pictureList);
      if (this.curIndex >= this.pictures.pictureList.length) this.curIndex = 0; // jos index menee yli taulun pituuden asetetaan nollaksi

      this.pictures.pictureList[this.curIndex] = this.pictures.pictureList[this.curIndex];
      this.loadContent(this.pictures.pictureList[this.curIndex]._id);
    });
  }


  popComment() {
    if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
      // comment can't be empty or just space, first char can't be space if length < 3
      if (this.sendComment != "" ) { // && (this.sendComment.length >= 2 || !(this.sendComment.indexOf(" ") < 1))
        this.pictures.postComment(this.pictures.pictureList[this.curIndex]._id, this.sendComment).then((res) => {
          console.log(res);
          //this.loadContent(this.picture._id);
          this.sendComment = "";
          this.loadContent(this.pictures.pictureList[this.curIndex]._id);
          //  this.handleContent();
        });
      } else console.log("Invalid comment");
    } else this.user.loginAlert();
  }



  pushPage(name) {
    if (name === "feedi") {
      this.navCtrl.popToRoot();
    } else if (name === 'camera') {
      if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
        /*  this.camProvider.takePhoto().then(res =>{
            console.log(res);
          this.navCtrl.push(UpLoadPicPage, res);
          }); //*/
      } else this.user.loginAlert();
    } else if (name === 'me') {
      if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
        this.navCtrl.push(MePage);
      } else this.user.loginAlert();
    }

  }
}
