webpackJsonp([0],{

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeediPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_pic_pic__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_user__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_pictures_pictures__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__me_me__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_camera_camera__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_up_load_pic_up_load_pic__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_firebase__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
//import { SettingsPage } from './../settings-page/settings-page';
//import { Storage } from '@ionic/storage';


//import firebase from 'firebase';



//import { CameraPreview } from '@ionic-native/camera-preview';
//import { CamPage } from '../cam/cam';

//import { Platform } from 'ionic-angular';




//Melina kävi laittaa tännekin ton Http ja Pictures 7.11.2017
var FeediPage = (function () {
    // Melina sorkki tätä 7.11.2017
    function FeediPage(user, navCtrl, pictureService, modalCtrl, 
        //private platform: Platform,
        //private storage: Storage,
        menuCtrl, camProvider, firebase) {
        var _this = this;
        this.user = user;
        this.navCtrl = navCtrl;
        this.pictureService = pictureService;
        this.modalCtrl = modalCtrl;
        this.menuCtrl = menuCtrl;
        this.camProvider = camProvider;
        this.firebase = firebase;
        this.spinState = 'first';
        this.type = "default";
        //  this.user.googleLogout(); //kirjautuu ulos ja poistaa lokaalit käyttäjätiedot. tämä on testiä varten. 
        this.user.getLocalUserData();
        console.log("get userdata...");
        console.log(this.user.localUser);
        // Load newest feed, then start observing notifications,
        // if add was opened from notif, opens picture 
        this.pictureService.loadFeed().then(function (res) {
            //*
            _this.firebase.onNotificationOpen()
                .subscribe(function (notif) {
                console.log("Notification opened");
                console.log(notif);
                _this.notificationReceived(notif);
            }); //*/
        });
    }
    FeediPage.prototype.openMenu = function () {
        this.menuCtrl.open();
        //  this.user.googleLogout(); 
    };
    FeediPage.prototype.reloadFeed = function (type) {
        this.type = type;
        console.log(this.type);
        this.pictureService.pictureList = [];
        this.pictureService.feedType = this.type;
        this.pictureService.loadFeed();
        this.menuCtrl.close();
    };
    FeediPage.prototype.logout = function () {
        this.user.googleLogout();
        //  this.menuCtrl.close();
    };
    FeediPage.prototype.login = function () {
        this.user.googleLogin();
        // this.menuCtrl.close();
    };
    FeediPage.prototype.ionViewDidEnter = function () {
        this.menuCtrl.swipeEnable(true);
    };
    FeediPage.prototype.ionViewWillLeave = function () {
        this.menuCtrl.swipeEnable(false);
    };
    // Refresh feedPage
    FeediPage.prototype.doRefresh = function (refresher) {
        console.log("Refresh feed");
        this.pictureService.loadFeed();
        refresher.complete();
    };
    FeediPage.prototype.notificationReceived = function (data) {
        var _this = this;
        // if user tapped notification
        if (data.tap) {
            this.navCtrl.popToRoot();
            this.pictureService.getPicture(data.pic_id).then(function (picData) {
                // check if pic is in current list
                var index = -1;
                for (var i = 0; i < _this.pictureService.pictureList.length; i++) {
                    if (_this.pictureService.pictureList[i]._id === picData._id) {
                        index = i;
                        i = _this.pictureService.pictureList.length;
                    }
                }
                console.log("Pic index: " + index);
                // if not in list add to some index (not first or last, so extend functions still wors as expected)
                if (index < 0) {
                    console.log("Pic not in list, adding to position 1");
                    _this.pictureService.pictureList.splice(1, 0, picData);
                }
                console.log("Pic loaded using notification data, tryion to open");
                console.log(picData);
                _this.openPicPage(picData);
            });
        }
    };
    FeediPage.prototype.openPicPage = function (data) {
        console.log("pushing to picpage using:");
        console.log(data);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__pages_pic_pic__["a" /* PicPage */], { paramData: data }); // avaa kommenttisivun kuvaa klikatessa
        //this.navCtrl.push(UpLoadPicPage, {paramPic: this.base64Image, paramData: this.image_data});
    };
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
    FeediPage.prototype.pushPage = function (name) {
        var _this = this;
        if (name === "feedi") {
            this.navCtrl.popToRoot();
        }
        else if (name === 'camera') {
            if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
                this.camProvider.takePhoto().then(function (res) {
                    console.log("CAmera result:");
                    console.log(res);
                    if (res)
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__pages_up_load_pic_up_load_pic__["a" /* UpLoadPicPage */], res);
                });
            }
            else
                this.user.loginAlert();
        }
        else if (name === 'me') {
            if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
                this.user.checkTokenValidity().then(function (res) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__me_me__["a" /* MePage */]);
                });
            }
            else {
                console.log("User invalid");
                this.user.loginAlert();
            }
        }
    };
    return FeediPage;
}());
FeediPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-feedi',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\feedi\feedi.html"*/'\n\n<ion-header>\n\n  <ion-navbar>\n\n    <div menu-toggle="menu" (click)="openMenu()">\n\n      <ion-icon id="navicon" name="md-menu"></ion-icon>\n\n    </div>\n\n    <img id="logoTopNav" src="assets/img/Logo-2.png" (click)=\'user.toggleNotificationType("newFollowed",true)\' />\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content id="paddingBot">\n\n  <div *ngIf="pictureService.feedType===\'default\'">\n\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n\n      <ion-refresher-content></ion-refresher-content>\n\n    </ion-refresher>\n\n  </div>\n\n\n\n  <ion-card *ngFor="let picture of pictureService.pictureList" class="card-bg-container">\n\n    <div (click)=\'openPicPage(picture);\' class="buttonBox">\n\n      <!--div class="card-titleTop"> </div-->\n\n      <div class="card-title-block">\n\n        <div class="card-title">{{picture.title}}\n\n          <div id="score">\n\n            <p id="scoreNumber">{{picture.score}}</p>\n\n          </div>\n\n        </div>\n\n      </div>\n\n      <div>\n\n        <img id="pic" src="{{picture.name}}" />\n\n      </div>\n\n    </div>\n\n  </ion-card>\n\n  <div *ngIf="pictureService.feedType===\'default\'">\n\n  <ion-card no-border no-shadow id="loadPicCard" ng-class="divClass" (click)="pictureService.extendPictures()">\n\n    <img *ngIf="!pictureService.loading" class="loadMorePic" src="assets/img/keep_ogling_icon.png" />\n\n    <img *ngIf="pictureService.loading" id="spinCW" class="loadMorePic" src="assets/img/keep_ogling_icon.png" />\n\n  </ion-card>\n\n</div>\n\n<ion-card no-border no-shadow id="paddingCard"></ion-card>\n\n</ion-content>\n\n<div class="bottomNav">\n\n  <ion-icon class="bNavIcon" name="images" (click)="pushPage(\'feedi\')"></ion-icon>\n\n  <ion-icon class="bNavIcon" name="camera" (click)="pushPage(\'camera\')"></ion-icon>\n\n  <ion-icon class="bNavIcon" name="person" (click)="pushPage(\'me\')"></ion-icon>\n\n</div>\n\n\n\n\n\n<ion-nav #mainContent></ion-nav>\n\n<ion-menu id="menu" type="overlay"[content]="mainContent">\n\n  <ion-header>\n\n    <ion-toolbar>\n\n      <ion-title>Menu</ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n  <ion-content>\n\n    <ion-list radio-group [(ngModel)]="type" class="menulist">\n\n      <ion-item class="menuitem" on-tap="reloadFeed(\'default\');">\n\n        <ion-label>\n\n            Newest posts\n\n        </ion-label>\n\n        <ion-radio value="default"></ion-radio>\n\n      </ion-item> \n\n      <ion-item class="menuitem" on-tap="reloadFeed(\'best\');"> \n\n        <ion-label>\n\n            Most loved posts\n\n        </ion-label>\n\n        <ion-radio value="best"></ion-radio>\n\n      </ion-item>\n\n      <ion-item class="menuitem" on-tap="reloadFeed(\'poop\');">\n\n        <ion-label>\n\n            Most hated posts\n\n        </ion-label>\n\n        <ion-radio value="poop"></ion-radio> \n\n      </ion-item>  \n\n      <ion-item *ngIf="user.localUser.data.userID != \'Guest\'" class="menuitem" on-tap="reloadFeed(\'myPics\');">\n\n        <ion-label>\n\n          myPics\n\n        </ion-label>\n\n        <ion-radio value="myPics"></ion-radio> \n\n      </ion-item>  \n\n      <ion-item *ngIf="user.localUser.data.userID != \'Guest\'" class="menuitem" on-tap="reloadFeed(\'followedPics\');">\n\n        <ion-label>\n\n          followedPics\n\n        </ion-label>\n\n        <ion-radio value="followedPics"></ion-radio> \n\n      </ion-item> \n\n     <!-- <button id="nappula" (click)="reloadFeed();">Reload</button>   -->\n\n     <button *ngIf="user.localUser.data.userID != \'Guest\'" id="nappulaLogout" (click)="user.enableNotifications();">Enable Notifications</button> \n\n      <button *ngIf="user.localUser.data.userID != \'Guest\'" id="nappulaLogout" (click)="logout();">Logout</button> \n\n      <button *ngIf="user.localUser.data.userID == \'Guest\'" id="nappulaLogout" (click)="login();">Login</button> \n\n    </ion-list>\n\n  </ion-content>\n\n</ion-menu>'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\feedi\feedi.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_user_user__["a" /* User */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_pictures_pictures__["a" /* Pictures */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* MenuController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_camera_camera__["a" /* CameraProvider */],
        __WEBPACK_IMPORTED_MODULE_8__ionic_native_firebase__["a" /* Firebase */]])
], FeediPage);

//# sourceMappingURL=feedi.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CameraProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_camera__ = __webpack_require__(45);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CameraProvider = (function () {
    function CameraProvider(
        //private cameraPreview: CameraPreview,
        camera) {
        this.camera = camera;
    }
    CameraProvider.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 80,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: 800,
            targetWidth: 800,
            allowEdit: true,
            saveToPhotoAlbum: false // tallennetaanko kuva puhelimeen, kuva nakyy galleriassa yms
            //cameraDirection: this.camera.Direction.BACK
        };
        return this.camera.getPicture(options).then(function (imageData) {
            _this.image_data = imageData;
            _this.base64Image = "data:image/jpeg;base64," + imageData; // tallentaa kuvan muuttujaan base64-muodossa (teksti muotoinen kuva) 
            // return this.image_data;
            return { paramPic: _this.base64Image, paramData: _this.image_data }; // siirtyy seuraavalle sivulle ja ottaa parametrina mukaan kuvan
            // console.log("Push done! camPage");
        }, function (err) {
            console.log("Error in photo taking");
            console.log(err);
        });
    };
    return CameraProvider;
}());
CameraProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    //@Component({})
    ,
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_camera__["a" /* Camera */]])
], CameraProvider);

//# sourceMappingURL=camera.js.map

/***/ }),

/***/ 118:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 118;

/***/ }),

/***/ 161:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 161;

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PicPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_user_user__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_pictures_pictures__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__me_me__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__comment_form_comment_form__ = __webpack_require__(288);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// import { Observable } from 'rxjs/Observable';



// Melina kävi laittaa observarble, map ja Http




//import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
var PicPage = (function () {
    //data : any;
    //comments: Observable<any>;
    function PicPage(camera, navCtrl, http, 
        // public pictures: Pictures,
        navParams, pictures, alertCtrl, user, popoverCtrl) {
        this.camera = camera;
        this.navCtrl = navCtrl;
        this.http = http;
        this.navParams = navParams;
        this.pictures = pictures;
        this.alertCtrl = alertCtrl;
        this.user = user;
        this.popoverCtrl = popoverCtrl;
        this.sendComment = "";
        this.loaded = false;
        this.picScore = 0;
        this.comScore = 0;
        this.placeHolder = 'Write something nice';
        // ATM KUVA base64 muodossa kuva objection 'name' attribuutissa
        this.picture = this.navParams.get('paramData');
        //this.localArray = this.navParams.get('paramArray');
        this.curIndex = -1;
        for (var i = 0; i < this.pictures.pictureList.length; i++) {
            if (this.pictures.pictureList[i]._id === this.picture._id) {
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
    PicPage.prototype.ionViewDidLoad = function () {
        console.log("kuvasivu ladattu");
    };
    PicPage.prototype.ionViewWillEnter = function () {
        this.loaded = false;
        this.loadContent(this.pictures.pictureList[this.curIndex]._id);
    };
    // kuvien välillä swaippaus
    PicPage.prototype.swipeEvent = function (e) {
        var _this = this;
        var index = 0;
        if (e.direction === 2) {
            index = this.curIndex + 1;
            // jos taulusta loppuu kuvat sitä jatketaan,haetaan lisää kuvia
            if (index >= this.pictures.pictureList.length) {
                this.pictures.extendPictures().then(function (data) {
                    // jos index menee yli taulun pituuden ja vanhempia kuvia ei löydy, indeksi asetetaan nollaksi
                    if (index >= _this.pictures.pictureList.length) {
                        index = 0;
                        console.log("No older pictures available, jump to newest pic");
                    }
                    //this.picture = this.pictures.pictureList[index];
                    _this.curIndex = index;
                    _this.loadContent(_this.pictures.pictureList[_this.curIndex]._id);
                });
            }
            else {
                this.curIndex = index;
                this.loadContent(this.pictures.pictureList[this.curIndex]._id);
            }
        }
        if (e.direction === 4) {
            index = this.curIndex - 1;
            // jos index menee alle nollan asetetaan taulun viimeiseen
            if (index < 0)
                index = 0; //this.pictures.pictureList.length - 1; 
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
    };
    PicPage.prototype.loadContent = function (id) {
        var _this = this;
        //this.loaded = false;
        // hae data tietokannasta avatulle kuvalle
        this.pictures.getPicture(id).then(function (dataLocal) {
            dataLocal.name = _this.pictures.pictureList[_this.curIndex].name;
            console.log(dataLocal);
            _this.pictures.pictureList[_this.curIndex] = dataLocal;
            _this.calcPicScore();
            console.log(_this.pictures.pictureList[_this.curIndex].comments.length);
            _this.handleContent();
        });
    };
    PicPage.prototype.handleContent = function () {
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
        if (!this.pictures.pictureList[this.curIndex].hasVotedDown) {
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
    };
    PicPage.prototype.presentCommentForm = function () {
        var _this = this;
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_8__comment_form_comment_form__["a" /* CommentFormPage */], { pId: this.pictures.pictureList[this.curIndex]._id }, { cssClass: 'commentPopover', showBackdrop: true, enableBackdropDismiss: false });
        popover.present(); // kommentointi ikkunan näyttö
        popover.onDidDismiss(function () {
            _this.loadContent(_this.pictures.pictureList[_this.curIndex]._id);
        });
    };
    PicPage.prototype.showReportAlert = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Reason to snitch:',
            inputs: [
                {
                    type: 'radio',
                    label: 'Unwanted shapes or nudity',
                    value: 'Unwanted shapes or nudity' // Unwanted shapes or nudity, Too much skin
                },
                {
                    type: 'radio',
                    label: "Personal information",
                    value: 'Personal information' // Too much information, Personal information
                },
                {
                    type: 'radio',
                    label: "It's MEAN",
                    value: 'Its MEAN'
                },
                {
                    type: 'radio',
                    label: "This must be illegal",
                    value: 'Illegal content'
                },
                {
                    type: 'radio',
                    label: "Just for fun",
                    value: 'No reason'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Snitch',
                    handler: function (data) {
                        _this.trashPic(data);
                        return true;
                    }
                }
            ]
        });
        prompt.present();
    };
    PicPage.prototype.calcPicScore = function () {
        console.log("laske score kuvalle");
        var up = this.pictures.pictureList[this.curIndex].upvotes;
        var down = this.pictures.pictureList[this.curIndex].downvotes;
        if (!up)
            up = 0;
        if (!down)
            down = 0;
        var sum;
        sum = up - down;
        this.pictures.pictureList[this.curIndex].score = sum;
        // console.log(sum);
    };
    PicPage.prototype.calcComScore = function (up, down) {
        //  console.log("laske score kommentille");
        // var up: number = this.picture.comments[0].upvotes;
        //var down: number = this.picture.comments[0].downvotes;
        if (!up)
            up = 0;
        if (!down)
            down = 0;
        var sum;
        sum = up - down;
        this.comScore = sum;
        return sum;
    };
    PicPage.prototype.votePicture = function (ud) {
        var _this = this;
        if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
            console.log('trying to vote picture');
            var reVoter = false;
            if (this.pictures.pictureList[this.curIndex].hasVotedDown || this.pictures.pictureList[this.curIndex].hasVotedUp) {
                reVoter = true;
            }
            this.pictures.pictureList[this.curIndex].hasVotedDown = true;
            this.pictures.pictureList[this.curIndex].hasVotedUp = true;
            this.pictures.votePic(this.pictures.pictureList[this.curIndex]._id, ud, reVoter).then(function (res) {
                console.log(res);
                console.log("äänestys onnistui");
                _this.loadContent(_this.pictures.pictureList[_this.curIndex]._id);
            });
        }
        else
            this.user.loginAlert();
    };
    PicPage.prototype.voteComment = function (ud, _id, comIndex) {
        var _this = this;
        if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
            var reVoter = false;
            if (this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedDown || this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedUp) {
                reVoter = true;
            }
            console.log(comIndex);
            this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedUp = true;
            this.pictures.pictureList[this.curIndex].comments[comIndex].hasVotedDown = true;
            this.pictures.voteCom(_id, ud, this.pictures.pictureList[this.curIndex]._id, reVoter).then(function (res) {
                console.log(res);
                console.log("äänestys onnistui");
                _this.loadContent(_this.pictures.pictureList[_this.curIndex]._id);
            });
        }
        else
            this.user.loginAlert();
    };
    PicPage.prototype.trashPic = function (reasonToHate) {
        var _this = this;
        if (!reasonToHate) {
            reasonToHate = "No reason";
        }
        // var index;
        console.log('picture reported');
        this.pictures.trashPic(this.pictures.pictureList[this.curIndex]._id, this.user.localUser.data.userID, reasonToHate).then(function (res) {
            console.log(res);
            console.log("report success");
            console.log(_this.pictures.pictureList);
            _this.pictures.pictureList.splice(_this.curIndex, 1);
            console.log(_this.pictures.pictureList);
            if (_this.curIndex >= _this.pictures.pictureList.length)
                _this.curIndex = 0; // jos index menee yli taulun pituuden asetetaan nollaksi
            _this.pictures.pictureList[_this.curIndex] = _this.pictures.pictureList[_this.curIndex];
            _this.loadContent(_this.pictures.pictureList[_this.curIndex]._id);
        });
    };
    PicPage.prototype.popComment = function () {
        var _this = this;
        if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
            // comment can't be empty or just space, first char can't be space if length < 3
            if (this.sendComment != "") {
                this.pictures.postComment(this.pictures.pictureList[this.curIndex]._id, this.sendComment).then(function (res) {
                    console.log(res);
                    //this.loadContent(this.picture._id);
                    _this.sendComment = "";
                    _this.loadContent(_this.pictures.pictureList[_this.curIndex]._id);
                    //  this.handleContent();
                });
            }
            else
                console.log("Invalid comment");
        }
        else
            this.user.loginAlert();
    };
    PicPage.prototype.pushPage = function (name) {
        if (name === "feedi") {
            this.navCtrl.popToRoot();
        }
        else if (name === 'camera') {
            if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
                /*  this.camProvider.takePhoto().then(res =>{
                    console.log(res);
                  this.navCtrl.push(UpLoadPicPage, res);
                  }); //*/
            }
            else
                this.user.loginAlert();
        }
        else if (name === 'me') {
            if (this.user.localUser && this.user.localUser.data.userID != "Guest") {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__me_me__["a" /* MePage */]);
            }
            else
                this.user.loginAlert();
        }
    };
    return PicPage;
}());
PicPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'page-pic',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\pic\pic.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <img id="logoTopNav" src="assets/img/Logo-2.png"/>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="pagecontent" *ngIf="loaded" padding id="page3">\n\n    <ion-card no-border no-shadow id="paddingCardTop"></ion-card>\n\n  <div (swipe)="swipeEvent($event)">\n\n      \n\n    <div id="topPadding"> \n\n      <img src={{this.pictures.pictureList[curIndex].name}} style="top:60px;display:block;width:100%;height:auto;margin-left:auto;margin-right:auto;"\n\n      />\n\n      <ion-icon class="reportButton" name="ios-alert-outline" (click)="showReportAlert()"></ion-icon>\n\n    </div>\n\n\n\n    <div class="headeri">\n\n     <div *ngIf="this.pictures.pictureList[curIndex].ActivityStatus==null">\n\n       <img id="picPosterAvatar" src="assets/avatars_round/Guide.png"> \n\n      </div> \n\n      <div *ngIf="this.pictures.pictureList[curIndex].ActivityStatus!=null">\n\n        <img id="picPosterAvatar" src="assets/avatars_round/{{this.pictures.pictureList[curIndex].ActivityStatus}}"> \n\n      </div> \n\n      <div id="title"> {{this.pictures.pictureList[curIndex].title}} </div>\n\n      <div>\n\n        <!-- <div id="floatR"> -->\n\n        <div *ngIf="loaded  && !this.pictures.pictureList[curIndex].hasVotedDown">\n\n          <ion-icon (click)="votePicture(\'down\')" id="voteDown" name="ios-arrow-down-outline"></ion-icon>\n\n        </div>\n\n        <div *ngIf="loaded  && this.pictures.pictureList[curIndex].hasVotedDown">\n\n          <ion-icon class="hasVoted" id="voteDown" name="ios-arrow-down-outline"></ion-icon>\n\n        </div>\n\n        <div *ngIf="picScore<=19 && picScore>=-6" id="scoreT">{{this.pictures.pictureList[curIndex].score}}</div>\n\n        <div *ngIf="picScore>19" id="scoreT">\n\n          <img src="assets/img/goggles_high.png" />\n\n        </div>\n\n        <div *ngIf="picScore<-6" id="scoreT">\n\n          <img src="assets/img/poop.png" />\n\n        </div>\n\n        <div *ngIf="loaded  && !this.pictures.pictureList[curIndex].hasVotedUp">\n\n          <ion-icon (click)="votePicture(\'up\')" id="voteUp" name="ios-arrow-up-outline"></ion-icon>\n\n        </div>\n\n        <!--   <ion-icon (click)="showPrompt()" name="ios-trash" id="trashCan"></ion-icon> -->\n\n        <div *ngIf="loaded  && this.pictures.pictureList[curIndex].hasVotedUp">\n\n          <ion-icon class="hasVoted" id="voteUp" name="ios-arrow-up-outline"></ion-icon>\n\n        </div>\n\n        <!--  <ion-icon (click)="showPrompt()" name="ios-trash" id="trashCan"></ion-icon> -->\n\n        <!--    </div> -->\n\n\n\n        <!--  <div *ngIf="picScore<=19 && picScore>=-6" id="scoreT">{{picScore}}</div>\n\n      <div *ngIf="picScore>19" id="scoreT">\n\n        <img src="assets/img/goggles_high.png" />\n\n      </div>\n\n      <div *ngIf="picScore<-6" id="scoreT">\n\n        <img src="assets/img/poop.png" />\n\n      </div> -->\n\n      </div>\n\n    </div>\n\n\n\n   \n\n\n\n    <ion-list id="botPadding">\n\n      <ion-item  text-wrap *ngFor="let comment of this.pictures.pictureList[curIndex].comments; let commentIndex = index" class="commentbox">\n\n          <div *ngIf="comment.ActivityStatus==null">\n\n              <img id="commentPosterAvatar" src="assets/avatars_round/Guide.png"> \n\n             </div> \n\n             <div *ngIf="comment.ActivityStatus!=null">\n\n               <img id="commentPosterAvatar" src="assets/avatars_round/{{comment.ActivityStatus}}"> \n\n             </div> \n\n        <!-- .slice().reverse() kääntävät listan päinvsataiseen järjestykseen => uusin ensin  -->\n\n        <div id="commentIcons">\n\n          \n\n          <div *ngIf="!comment.hasVotedUp">\n\n            <ion-icon id="voteUp" (click)="voteComment(\'up\', comment._id, commentIndex)" id="voteIconUp" name="ios-arrow-up-outline"></ion-icon>\n\n          </div>\n\n          <div *ngIf="comment.hasVotedUp">\n\n            <ion-icon id="voteUp" class="hasVoted" id="voteIconUp" name="ios-arrow-up-outline"></ion-icon>\n\n          </div>\n\n\n\n          <div *ngIf="comment.score<=99 && comment.score>=-9" id="score">{{comment.score}}</div>\n\n          <div *ngIf="comment.score>99" id="score">\n\n            <img src="assets/Gems/Gems/Diamond-5.png" />\n\n          </div>\n\n          <div *ngIf="comment.score<-9" id="score">\n\n            <img src="assets/img/poop.png" />\n\n          </div>\n\n          \n\n          <div *ngIf="!comment.hasVotedDown">\n\n            <ion-icon id="voteDown" (click)="voteComment(\'down\', comment._id, commentIndex)" id="voteIconDown" name="ios-arrow-down-outline"></ion-icon>\n\n          </div>\n\n          <div *ngIf="comment.hasVotedDown">\n\n            <ion-icon id="voteDown" class="hasVoted" id="voteIconDown" name="ios-arrow-down-outline"></ion-icon>\n\n          </div>\n\n\n\n        </div>\n\n\n\n        <div id="comment">\n\n          <div *ngIf="comment.comment.length > 130" id="commentChild">\n\n            {{comment.comment}}\n\n          </div>\n\n          <div *ngIf="comment.comment.length <= 130" id="commentChild">\n\n            {{comment.comment}}\n\n          </div>\n\n        </div>\n\n       \n\n      </ion-item>\n\n    </ion-list>\n\n  </div>\n\n  <ion-card no-border no-shadow id="paddingCard"></ion-card>\n\n</ion-content>\n\n\n\n<ion-footer keyboard-attach class="commentFooter">\n\n  <label class="textBoxOutline">\n\n    <textarea class="textBox" id="text-area-id" type="text" rows="1" [(ngModel)]="sendComment" placeholder="Write something nice"\n\n      value="placeHolder" on-return="popComment()"></textarea>\n\n    <!-- <input class="textBox" type="text" [(ngModel)]="sendComment" placeholder="Type your message" on-return="popComment()" /> -->\n\n  </label>\n\n  <ion-icon class="arrow" name="ios-arrow-forward-outline" (click)="popComment()"></ion-icon>\n\n</ion-footer>\n\n\n\n<!--\n\n<div class="comment">\n\n  <ion-item [(ngModel)]="sendComment" id="commentbox">\n\n    <ion-textarea rows="5" placeholder="Write something awesome!" maxLength="500"></ion-textarea>\n\n  </ion-item>\n\n\n\n  <button id="commentBut" (click)="popComment();" ion-button color="stable" block>\n\n    Comment\n\n  </button>\n\n</div> -->\n\n\n\n<!-- KOMMENTTINAPPI\n\n<div id="comButParent">\n\n  <ion-icon id="comment-button" name="md-create" (click)="presentCommentForm()"></ion-icon>\n\n</div> -->\n\n\n\n<!--button (click)=" presentCommentForm()" id="comment-button" ion-button color="stable" block>\n\n    Write comment\n\n  </button-->\n\n<!--div class="bottomNav">\n\n  <ion-icon class="bNavIcon" name="images" (click)="pushPage(\'feedi\')"></ion-icon>\n\n  <ion-icon class="bNavIcon" name="camera" (click)="pushPage(\'camera\')"></ion-icon>\n\n  <ion-icon class="bNavIcon" name="person" (click)="pushPage(\'me\')"></ion-icon>\n\n</div-->\n\n'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\pic\pic.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3__angular_http__["Http"],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_6__providers_pictures_pictures__["a" /* Pictures */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_user_user__["a" /* User */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* PopoverController */]])
], PicPage);

//# sourceMappingURL=pic.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Feedback; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_user__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var Feedback = (function () {
    function Feedback(http, user) {
        this.http = http;
        this.user = user;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]({ 'Content-Type': 'application/json' });
    }
    Feedback.prototype.postFeedback = function (sendFeedback) {
        var data = {
            'text': sendFeedback,
            'userID': this.user.localUser.data.userID
        };
        console.log(data);
        this.http.post(this.user.address + '/feedback', JSON.stringify(data), { headers: this.headers })
            .map(function (res) {
            return res.json();
        })
            .subscribe(function (err) { return console.log(err); });
    };
    return Feedback;
}());
Feedback = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"],
        __WEBPACK_IMPORTED_MODULE_4__user_user__["a" /* User */]])
], Feedback);

//# sourceMappingURL=feedback.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CamPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__up_load_pic_up_load_pic__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera_preview__ = __webpack_require__(210);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






// import { Crop } from 'ionic-native';
var CamPage = (function () {
    function CamPage(navCtrl, camera, cameraPreview) {
        this.navCtrl = navCtrl;
        this.camera = camera;
        this.cameraPreview = cameraPreview;
        this.image_data = null;
        this.camOk = false;
    }
    CamPage.prototype.ionViewWillLeave = function () {
        this.closeCamera();
    };
    CamPage.prototype.ionViewWillEnter = function () {
        this.openCamera();
        //this.takePhoto();
    };
    // Camera Preview plugari: kameran käynntstys
    CamPage.prototype.openCamera = function () {
        var cameraPreviewOpts = {
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
        this.cameraPreview.startCamera(cameraPreviewOpts).then(function (res) {
            console.log(res);
        }, function (err) {
            console.log(err);
        });
        // this.cameraPreview.startCamera(cameraPreviewOpts);
        //this.cameraPreview.show();
        // this.cameraPreview.stopCamera();
    };
    // Camera Preview plugari: Kuvan otto
    // NOTE: atm plugari toimii vaihtelevasti eri laitteilla
    CamPage.prototype.takePic = function () {
        var _this = this;
        var pictureOpts = {
            width: 1280,
            height: 720,
            quality: 85
        };
        this.cameraPreview.takePicture(pictureOpts).then(function (imageData) {
            _this.image_data = imageData;
            console.log(imageData);
            //   this.closeCamera ()
            _this.base64Image = "data:image/jpeg;base64," + imageData; // tallentaa kuvan muuttujaan base64-muodossa (teksti muotoinen kuva) 
            //   console.log(this.base64Image);
            //   console.log(this.image_data);
            _this.cameraPreview.hide();
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__up_load_pic_up_load_pic__["a" /* UpLoadPicPage */], { paramPic: _this.base64Image, paramData: _this.image_data }); // siirtyy seuraavalle sivulle ja ottaa parametrina mukaan kuvan  
        }, function (err) {
            console.log(err);
        });
    };
    CamPage.prototype.pushPage = function () {
        var tBase64Image = " ";
        var tImage_Data = " ";
        this.closeCamera();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__up_load_pic_up_load_pic__["a" /* UpLoadPicPage */], { paramPic: tBase64Image, paramData: tImage_Data });
    };
    // Camera Preview plugari: kameran sammutus
    CamPage.prototype.closeCamera = function () {
        this.cameraPreview.stopCamera().then(function (res) {
            console.log(res);
        }, function (err) {
            console.log(err);
        });
    };
    // Native Camera: kameran avaus ja kuvan otto
    CamPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: 1280,
            targetWidth: 1280,
            allowEdit: true,
            saveToPhotoAlbum: true // tallennetaanko kuva puhelimeen, kuva nakyy galleriassa yms
            // cameraDirection: this.camera.Direction.BACK
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.image_data = imageData;
            _this.base64Image = "data:image/jpeg;base64," + imageData; // tallentaa kuvan muuttujaan base64-muodossa (teksti muotoinen kuva) 
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__up_load_pic_up_load_pic__["a" /* UpLoadPicPage */], { paramPic: _this.base64Image, paramData: _this.image_data }); // siirtyy seuraavalle sivulle ja ottaa parametrina mukaan kuvan
            // console.log("Push done! camPage");
        }, function (err) {
            console.log(err);
        });
    };
    return CamPage;
}());
CamPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-cam',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\cam\cam.html"*/'\n\n<ion-header>\n\n  <ion-navbar>\n\n      <img id="logoTopNav" src="assets/img/oddogle_white_1.png"/>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    \n\n\n\n        <img id="takePicButton" src="assets/img/nappi.png"  (click)="takePhoto()"/>\n\n\n\n    \n\n      <!--ion-icon (click)="takePic()" id="takePicButton" name="radio-button-on"></ion-icon-->\n\n      <!--button (click)="pushPage()" id="pushPicButton" ion-button color="stable" block>Pushpage</button-->\n\n</ion-content>'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\cam\cam.html"*/,
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera_preview__["a" /* CameraPreview */]])
], CamPage);

//# sourceMappingURL=cam.js.map

/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angular2_jwt__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_firebase__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




 // login credentiaalien tallennus




var User = (function () {
    function User(http, googlePlus, jwtHelper, storage, alertCtrl, firebase) {
        /*
          this.firebase.getToken()
          .then(token => console.log(token)) // save the token server-side and use it to push notifications to this device
          .catch(error => console.error('Error getting token', error));
        
        this.firebase.onTokenRefresh()
          .subscribe((token: string) => console.log(token));
        // */
        this.http = http;
        this.googlePlus = googlePlus;
        this.jwtHelper = jwtHelper;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.firebase = firebase;
        this.guestUser = {
            data: {
                ActivityStatus: "guide.png",
                level: 0,
                oddBucksBalance: 0,
                points: 0,
                userID: "Guest",
                xp: 0,
                longestComment: 0,
                fcmPermissions: {
                    newComments: false
                }
            },
            refreshToken: null,
            token: null,
            curPercent: 0,
            deviceToken: "",
        };
        this.localUser = this.guestUser;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]({ 'Content-Type': 'application/json' });
        // backend adress
        //  address = "https://oddogleapis.com";
        //address = "http://10.0.1.39:3000";
        this.address = "https://dev.oddogleapis.com";
    }
    // Enable notifications fro new comments
    User.prototype.enableNotifications = function () {
        var _this = this;
        this.firebase.onTokenRefresh()
            .subscribe(function (token) {
            console.log(token);
            _this.localUser.deviceToken = token;
            _this.sendNotificationToken(token);
        });
    };
    // Add token to user
    User.prototype.sendNotificationToken = function (token) {
        var _this = this;
        return this.checkTokenValidity().then(function (res) {
            var data = {
                'deviceToken': _this.localUser.deviceToken,
                'token': _this.localUser.token
            };
            return _this.http.put(_this.address + '/updateFCMToken', JSON.stringify(data), { headers: _this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                console.log("FCM token posted");
                console.log(data);
                _this.localUser.deviceToken = data.deviceToken;
                _this.storeLocalUser(_this.localUser);
                return data;
            })
                .catch(function (err) {
                console.log(err);
                console.log("error");
            });
        });
    };
    // Toggle notification type on/off
    // possible types: newComments, newFollowed
    // possible values: true / false
    User.prototype.toggleNotificationType = function (type, value) {
        var _this = this;
        return this.checkTokenValidity().then(function (res) {
            var data = {
                'token': _this.localUser.token,
                'type': type,
                'value': value
            };
            return _this.http.post(_this.address + '/toggleNotificationType', JSON.stringify(data), { headers: _this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                console.log("Permissions setting changed");
                console.log(data);
                _this.localUser.data.fcmPermissions[data.type] = data.value;
                //this.localUser.fcmPermissions=data.deviceToken;
                _this.storeLocalUser(_this.localUser);
                return data;
            })
                .catch(function (err) {
                console.log(err);
                console.log("error");
            });
        });
    };
    // Alert, presented if not logged in when trying to publish something (post pic, comment etc)
    User.prototype.loginAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Login required',
            message: "This action requires user account, please login to continue current action. You may continue using application without login but you can't take pictures, comment, vote or access profile page. <br> <br> Your google login is used only for authentication. Your personal data is not stored nor shown to other users. ",
            buttons: [
                {
                    text: "Read more",
                    handler: function () {
                        console.log('read more clicked');
                        window.open('https://www.oddogle.com/terms-of-service/');
                    }
                },
                {
                    text: "Cancel",
                    role: "cancel",
                    handler: function () {
                        console.log('Cancel clicked');
                        _this.localUser = _this.guestUser;
                    }
                }, {
                    text: "Login with google",
                    handler: function () {
                        console.log('Login clicked');
                        _this.googleSilentLogin();
                    }
                }
            ]
        });
        alert.present();
    };
    // Alert, presented if not logged in when app opens
    User.prototype.loginAlertSoft = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Do you want to login?',
            message: "This action requires user account, please login to continue current action. You may continue using application without login but you can't take pictures, comment, vote or access profile page. <br> <br> Your google login is used only for authentication. Your personal data is not stored nor shown to other users. ",
            buttons: [
                {
                    text: "Read more",
                    handler: function () {
                        console.log('read more clicked');
                        window.open('https://www.oddogle.com/terms-of-service/');
                    }
                },
                {
                    text: "Cancel",
                    role: "cancel",
                    handler: function () {
                        console.log('Cancel clicked');
                        _this.localUser = _this.guestUser;
                    }
                }, {
                    text: "Login with google",
                    handler: function () {
                        console.log('Login clicked');
                        _this.googleSilentLogin();
                    }
                }
            ]
        });
        alert.present();
    };
    /* ---  Functions for (google) logins etc --- */
    // Login with google account and save userId locally
    // also get user data for that id (or create new account)
    User.prototype.googleLogin = function () {
        var _this = this;
        console.log("trying regular login ");
        return this.googlePlus.login({
            // 'androidClientId': 'AIzaSyCMVRCFWxZsT_rEgKm7V1KVy5GLkqmLm6E'
            'webClientId': '323555438273-s6v7hjv7nn260sraj2d8vi5lesqhjen6.apps.googleusercontent.com'
            // ,'offline': false
        })
            .then(function (res) {
            // if success, save userId to local storage
            //this.storeUserId(res);
            console.log(res);
            _this.authenticateUser(res.idToken);
        })
            .catch(function (err) {
            console.log("Error occured during login, try again?");
            console.error(err);
        });
    };
    // Google silent login if needed
    User.prototype.googleSilentLogin = function () {
        var _this = this;
        console.log("trying silent login ");
        return this.googlePlus.trySilentLogin({
            //  'androidClientId': 'AIzaSyCMVRCFWxZsT_rEgKm7V1KVy5GLkqmLm6E'
            'webClientId': '323555438273-s6v7hjv7nn260sraj2d8vi5lesqhjen6.apps.googleusercontent.com'
        })
            .then(function (res) {
            // if success, get user data from server
            //  this.storeUserId(res);
            console.log("silent login success");
            //console.log(res);
            return _this.authenticateUser(res.idToken);
        })
            .catch(function (err) {
            console.error(err);
            console.log("silent login failed, trying regular login");
            // if silent login fails, use regular login
            return _this.googleLogin();
        });
    };
    // save user data to local storage
    User.prototype.storeLocalUser = function (data) {
        this.localUser = data;
        this.storage.set('localUser', data);
        //console.log(this.localUser);
    };
    // logout and remove userdata from local storage
    User.prototype.googleLogout = function () {
        var _this = this;
        this.localUser = this.guestUser;
        this.googlePlus.logout()
            .then(function (res) {
            console.log(res);
            //this.userId = "";
            //this.storage.remove('userId');
            // this.localUser = "";
            _this.storage.remove('localUser');
        })
            .catch(function (err) {
            console.error(err);
            //this.userId = "";
            //this.storage.remove('userId');
            //   this.localUser = "";
            _this.storage.remove('localUser');
        });
    };
    // Get userdata from backend/DB for user logged in
    // needs google id token
    User.prototype.authenticateUser = function (token) {
        var _this = this;
        var data = {
            id_token: token
        };
        //console.log(data)
        return this.http.post(this.address + '/authUser', JSON.stringify(data), { headers: this.headers })
            .map(function (res) { return res.json(); })
            .toPromise()
            .then(function (data) {
            _this.localUser = data;
            console.log("User authenticated & data acquired from server.");
            console.log(_this.localUser);
            _this.localUser.curPercent = 0;
            _this.storeLocalUser(_this.localUser);
            return;
        })
            .catch(function (error) {
            console.log(error);
            return; // error.json();
        });
    };
    // get data from local storage
    User.prototype.getLocalUserData = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.storage.get('localUser').then(function (res) {
                if (res && res.data.userID != "Guest") {
                    console.log("Local user loaded!");
                    _this.localUser = res;
                    console.log(_this.localUser);
                    if (_this.localUser.token === null) {
                        _this.loginAlertSoft();
                    }
                }
                else {
                    console.log("No localUser, login required");
                    _this.loginAlertSoft();
                }
            }).catch(console.log);
        });
    };
    // Make sure token is valid for atleast 1 minute,
    // if not refresh token using refreshToken
    User.prototype.checkTokenValidity = function () {
        var _this = this;
        var lToken = this.jwtHelper.decodeToken(this.localUser.token);
        var curTime = (Date.now() / 1000);
        curTime = curTime + 60;
        //console.log("Current time: " + curTime);
        //console.log("Exp time: " + lToken.exp);
        if (lToken.exp <= curTime) {
            console.log("Token expired / about to expire. Time to get new.");
            //console.log(this.localUser);
            return this.refreshToken()
                .then(function (res) {
                if (res)
                    _this.checkTokenValidity(); //
                else {
                    console.log("Token refresh failed, login using google.");
                    return _this.googleSilentLogin().then(function (res) {
                        _this.checkTokenValidity();
                    });
                }
            });
        }
        else {
            console.log("Token OK to use.");
            //return some empty promise to resolve succesfull validity check
            return new Promise(function (resolve) { resolve(); });
        }
        //this.checkTokenValidity();'
    };
    User.prototype.refreshToken = function () {
        var _this = this;
        if (this.localUser.token && this.localUser.refreshToken) {
            var data = {
                token: this.localUser.token,
                refreshToken: this.localUser.refreshToken
            };
            //console.log(data)
            return this.http.post(this.address + '/token', JSON.stringify(data), { headers: this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                //console.log(lToken);
                _this.localUser.token = data.token;
                console.log("User token updated");
                console.log(_this.localUser);
                return true;
            })
                .catch(function (error) {
                console.log("Token update failed with error:");
                console.log(error);
                //this.googleSilentLogin();// error.json()
                return false;
            });
        }
        else {
            return new Promise(function (resolve) { resolve(); });
        }
    };
    User.prototype.getUserData = function () {
        var _this = this;
        return this.checkTokenValidity().then(function (res) {
            console.log("Sending request for user data");
            var data = {
                token: _this.localUser.token
            };
            //console.log(data);      
            return _this.http.post(_this.address + '/getUser', JSON.stringify(data), { headers: _this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                _this.localUser.data = data;
                if (!_this.localUser.curPercent) {
                    console.log("Set cur Percent to 0");
                    _this.localUser.curPercent = 0;
                }
                console.log("User data acquired from server.");
                console.log(_this.localUser);
                _this.storeLocalUser(_this.localUser);
            })
                .catch(function (error) {
                console.log(error);
                // return;// error.json();
            });
        });
    };
    return User;
}());
User = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__["a" /* GooglePlus */],
        __WEBPACK_IMPORTED_MODULE_6_angular2_jwt__["JwtHelper"],
        __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_8__ionic_native_firebase__["a" /* Firebase */]])
], User);

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(230);

//import {enableProdMode} from '@angular/core';

//enableProdMode();
Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_tabs_tabs__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_camera_preview__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_storage__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_google_plus__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angular2_jwt__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_firebase__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_cam_cam__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_feedi_feedi__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_pic_pic__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_up_load_pic_up_load_pic__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_me_me__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_home_home__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__providers_pictures_pictures__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__providers_user_user__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__providers_camera_camera__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__providers_feedback_feedback__ = __webpack_require__(208);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// Angular/ionic plugins













//import { ScreenOrientation } from '@ionic-native/screen-orientation';
// Pages:
//import { CommentFormPage } from '../pages/comment-form/comment-form'
//import { SignupPage } from '../pages/signup/signup';






//import { SettingsPage } from './../pages/settings-page/settings-page';
// Providers




//8.11.2017
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_14__pages_cam_cam__["a" /* CamPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_feedi_feedi__["a" /* FeediPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_pic_pic__["a" /* PicPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_up_load_pic_up_load_pic__["a" /* UpLoadPicPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_me_me__["a" /* MePage */],
            __WEBPACK_IMPORTED_MODULE_19__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_1__components_tabs_tabs__["a" /* TabsComponent */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_7__angular_http__["HttpModule"],
            __WEBPACK_IMPORTED_MODULE_7__angular_http__["JsonpModule"],
            __WEBPACK_IMPORTED_MODULE_10__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */], {}, {
                links: []
            }),
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_14__pages_cam_cam__["a" /* CamPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_feedi_feedi__["a" /* FeediPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_pic_pic__["a" /* PicPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_up_load_pic_up_load_pic__["a" /* UpLoadPicPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_me_me__["a" /* MePage */],
            __WEBPACK_IMPORTED_MODULE_1__components_tabs_tabs__["a" /* TabsComponent */],
            __WEBPACK_IMPORTED_MODULE_19__pages_home_home__["a" /* HomePage */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_20__providers_pictures_pictures__["a" /* Pictures */],
            __WEBPACK_IMPORTED_MODULE_21__providers_user_user__["a" /* User */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_camera_preview__["a" /* CameraPreview */],
            // Login,
            __WEBPACK_IMPORTED_MODULE_23__providers_feedback_feedback__["a" /* Feedback */],
            __WEBPACK_IMPORTED_MODULE_12_angular2_jwt__["JwtHelper"],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_google_plus__["a" /* GooglePlus */],
            __WEBPACK_IMPORTED_MODULE_13__ionic_native_firebase__["a" /* Firebase */],
            __WEBPACK_IMPORTED_MODULE_22__providers_camera_camera__["a" /* CameraProvider */],
            { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["c" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_feedi_feedi__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_pictures_pictures__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_user__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





//import { TabsComponent } from '../components/tabs/tabs';
//import firebase from 'firebase'; 



var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, pictureService, user, menuCtrl) {
        this.pictureService = pictureService;
        this.user = user;
        this.menuCtrl = menuCtrl;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_feedi_feedi__["a" /* FeediPage */]; // määrittää feedi-sivun rootsivuksi
        platform.ready().then(function () {
            statusBar.styleLightContent();
            splashScreen.hide();
        });
    }
    return MyApp;
}());
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>   '/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_5__providers_pictures_pictures__["a" /* Pictures */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_user__["a" /* User */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* MenuController */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentFormPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_pictures_pictures__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_user__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CommentFormPage = (function () {
    function CommentFormPage(navCtrl, navParams, formBuilder, user, viewCtrl, pictures) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.user = user;
        this.viewCtrl = viewCtrl;
        this.pictures = pictures;
        this.validation_messages = {
            'comment': [
                { type: 'required', message: 'Comment is required.' },
                { type: 'minlength', message: 'Comment is too short.' },
                { type: 'maxlength', message: 'Comment is too long.' }
            ]
        };
        this.picId = this.navParams.get('pId');
        // luodaan formi 
        this.commentForm = this.formBuilder.group({
            // ---- username input ja sen ehdot
            comment: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([
                    __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(500),
                    __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(0),
                    __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required
                ])]
        });
        console.log("comment page constr");
    }
    CommentFormPage.prototype.logForm = function () {
        var _this = this;
        console.log(this.commentForm.value);
        this.pictures.postComment(this.picId, this.commentForm.value.comment).then(function (res) {
            console.log(res);
            _this.viewCtrl.dismiss();
            return res;
        });
    };
    CommentFormPage.prototype.popView = function () {
        this.navCtrl.pop();
    };
    return CommentFormPage;
}());
CommentFormPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'page-comment-form',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\comment-form\comment-form.html"*/'<ion-content class="popover" >\n    <ion-navbar>\n        <ion-title>Comment</ion-title>\n      </ion-navbar>\n  <div class="validation-errors">\n    <ng-container *ngFor="let validation of validation_messages.comment">\n      <div class="error-message" *ngIf="commentForm.get(\'comment\').hasError(validation.type) && (commentForm.get(\'comment\').dirty || commentForm.get(\'comment\').touched)">\n        {{validation.message}}\n      </div>\n    </ng-container>\n  </div>\n\n  <form [formGroup]="commentForm" (ngSubmit)="logForm()">\n    <!-- comment input -->\n    <ion-item>\n      <ion-label floating>Your awesome comment goes there</ion-label>\n      <ion-textarea type="text" rows=5 formControlName="comment" ></ion-textarea>\n    </ion-item>\n    <button class="float_right" ion-button type="submit" [disabled]="!commentForm.valid">Comment</button>\n  </form>\n  <button ion-button (click)="popView()" class="float_left">Back</button>\n\n\n</ion-content>\n'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\comment-form\comment-form.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_user__["a" /* User */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_0__providers_pictures_pictures__["a" /* Pictures */]])
], CommentFormPage);

//# sourceMappingURL=comment-form.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pages_me_me__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_feedi_feedi__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_cam_cam__ = __webpack_require__(209);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// importataan sivut tabeja varten
var TabsComponent = (function () {
    function TabsComponent() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_2__pages_feedi_feedi__["a" /* FeediPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_3__pages_cam_cam__["a" /* CamPage */]; // määritetään tabeille sivut
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_1__pages_me_me__["a" /* MePage */];
    }
    return TabsComponent;
}());
TabsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'tabs',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\components\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab class="nav-tab" tabIcon="images" [root]="tab1Root"></ion-tab>\n\n  <ion-tab class="nav-tab" tabIcon="camera" [root]="tab2Root"></ion-tab>\n\n  <ion-tab class="nav-tab" tabIcon="person" [root]="tab3Root"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\components\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [])
], TabsComponent);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomePage = (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-home',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-navbar class="top-bar">\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n<h1> HELLOED </h1>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Pictures; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_user__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//import { JwtHelper } from "angular2-jwt";

// 8.11.2017
//import { Jsonp } from '@angular/http';
var Pictures = (function () {
    function Pictures(http, 
        // private jwtHelper: JwtHelper,
        user
        /*private _jsonp: Jsonp*/
    ) {
        this.http = http;
        this.user = user;
        this.pictureList = [];
        this.feedType = "default";
        //address = "https://oddogleapis.com";
        // address = "http://10.0.1.39:3000";
        this.address = "https://dev.oddogleapis.com";
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["Headers"]({ 'Content-Type': 'application/json' });
        this.data = null;
        this.dataLocal = null;
    }
    Pictures.prototype.loadFeed = function () {
        var _this = this;
        this.loading = true;
        //  console.log(this.login.localUser);
        // Hae kuvat ja niiden data
        var date;
        if (this.pictureList.length > 0) {
            date = this.pictureList[0].dateTime;
            return this.getNewPictures(date).then(function (data) {
                var tempArray;
                console.log("Number of new pics: " + data.length);
                if (data.length == 0) {
                    _this.loading = false;
                    return;
                } // jos ei tulekaan uusia kuvia
                console.log(data);
                tempArray = data;
                for (var n = 0; n < tempArray.length; n++) {
                    _this.pictureList.unshift(tempArray[n]);
                }
                //this.pictureList=this.tempArray;
                _this.pictureList = _this.checkForHaters(_this.pictureList);
                _this.loading = false;
            });
        }
        else {
            console.log("Get feed..");
            return this.getPictures(this.feedType).then(function (data) {
                console.log(data);
                _this.pictureList = data;
                _this.pictureList = _this.checkForHaters(_this.pictureList);
                // kun feedi haettu tarkista käyttäjäs
                _this.loading = false;
            });
        }
    };
    Pictures.prototype.extendPictures = function () {
        var _this = this;
        this.loading = true;
        if (this.pictureList.length == 0) {
            this.loadFeed();
            return new Promise(function (resolve) { resolve(); });
        }
        console.log((this.pictureList[this.pictureList.length - 1].dateTime));
        return this.getOlderPictures(this.pictureList[this.pictureList.length - 1].dateTime).then(function (data) {
            console.log("Number of older pics: " + data.length);
            console.log(data);
            for (var n = 0; n < data.length; n++) {
                _this.pictureList.push(data[n]);
            }
            console.log(_this.pictureList);
            _this.pictureList = _this.checkForHaters(_this.pictureList);
            _this.loading = false;
        });
    };
    Pictures.prototype.checkForHaters = function (array) {
        console.log("User: " + this.user.localUser.data.userID);
        console.log("Array length: " + array.length);
        if (this.user.localUser && this.user.localUser.data.userID) {
            for (var i = 0; i < array.length; i++) {
                //console.log(i);
                //console.log(array[i]);
                /* //laske score kuvalle, score tulee backendistä
                  var up: number = array[i].upvotes;
                  var down: number = array[i].downvotes;
                  if (!up) up = 0;
                  if (!down) down = 0;
                  array[i].score = up - down;
                */
                // console.log("check index " + i)
                if (array[i] && array[i].haters) {
                    //   console.log(array[i].haters);
                    for (var h = 0; h < array[i].haters.length; h++) {
                        if (array[i].haters[h] === this.user.localUser.data.userID) {
                            console.log("pic removed from list");
                            array.splice(i, 1);
                            h = 0;
                            if (i > 0) {
                                i--;
                            }
                        }
                    }
                }
            }
        }
        console.log("User: " + this.user.localUser.data.userID);
        return array;
    };
    // http://localhost:3000/comments
    // http://46.101.110.105:3000/comments/
    Pictures.prototype.getPictures = function (type) {
        var _this = this;
        return new Promise(function (resolve) {
            // for users own pictures add userID to url
            if (type === "myPics" || type === "followedPics") {
                type = type + "&" + _this.user.localUser.data.userID;
            }
            _this.http.get(_this.address + '/pictures/' + type)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                //console.log(data);
                resolve(data);
            });
        });
    };
    Pictures.prototype.getNewPictures = function (date) {
        var _this = this;
        if (this.feedType === "default") {
            return new Promise(function (resolve) {
                _this.http.get(_this.address + '/pictures/new/' + date)
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) {
                    _this.data = data;
                    //console.log(data);
                    resolve(data);
                });
            });
        }
        else {
            return new Promise(function (resolve) { resolve({}); });
        }
    };
    Pictures.prototype.getOlderPictures = function (date) {
        var _this = this;
        if (this.feedType === "default") {
            return new Promise(function (resolve) {
                _this.http.get(_this.address + '/pictures/more/' + date)
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) {
                    //console.log(data);
                    resolve(data);
                });
            });
        }
        else {
            return new Promise(function (resolve) { resolve({}); });
        }
    };
    Pictures.prototype.getPicture = function (_id) {
        var _this = this;
        //  console.log('https://oddogleapis.com/pictures/' + _id);
        return new Promise(function (resolve) {
            _this.http.get(_this.address + '/picture/' + _id + "&" + _this.user.localUser.data.userID) //tällä kestää aikaa, tapahtuu kun kerkee
                .map(function (res) { return res.json(); })
                .subscribe(function (dataLocal) {
                resolve(dataLocal);
            });
        });
    };
    Pictures.prototype.postPictures = function (fname, Header, picture, fdate) {
        var _this = this;
        return this.user.checkTokenValidity().then(function (res) {
            var data = {
                'pic': picture,
                'title': Header,
                'name': fname,
                'date': fdate,
                'token': _this.user.localUser.token
            };
            //   console.log('http://46.101.110.105:3000/pictures' + fname + Header + flink + fdate)
            return _this.http.post(_this.address + '/postPicture', JSON.stringify(data), { headers: _this.headers })
                .toPromise()
                .then(function (data) {
                console.log("picture posted");
                return data;
            })
                .catch(function (err) {
                console.log(err);
                console.log("error");
            });
        });
    };
    Pictures.prototype.postComment = function (pic_id, sendComment) {
        var _this = this;
        return this.user.checkTokenValidity().then(function (res) {
            var data = {
                'id': pic_id,
                'comment': sendComment,
                'token': _this.user.localUser.token,
                'curLongestComment': _this.user.localUser.data.longestComment
            };
            // console.log('http://46.101.110.105:3000/comments/' + _id + sendComment)
            return _this.http.put(_this.address + '/postComment', JSON.stringify(data), { headers: _this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                console.log("comment posted");
                return data;
            })
                .catch(function (err) {
                console.log(err);
                console.log("error");
            });
        });
    };
    Pictures.prototype.votePic = function (_id, ud, reVoter) {
        var _this = this;
        return this.user.checkTokenValidity().then(function (res) {
            console.log("token check done???!!?!?");
            var data = {
                "type": ud,
                "token": _this.user.localUser.token,
                "reVoter": reVoter
            };
            console.log(_id);
            console.log(data);
            //console.log(userID);
            return _this.http.put(_this.address + '/pictures/vote/' + _id, JSON.stringify(data), { headers: _this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                //console.log("mäoontäällä");
                return data;
            })
                .catch(function (err) {
                console.log(err);
                console.log("error");
            });
        });
    };
    Pictures.prototype.voteCom = function (_id, ud, pId, reVoter) {
        var _this = this;
        return this.user.checkTokenValidity().then(function (res) {
            var data = {
                "type": ud,
                "picId": pId,
                "token": _this.user.localUser.token,
                "reVoter": reVoter
            };
            console.log("Token checked and ok to use!");
            console.log(_id);
            console.log(data);
            return _this.http.put(_this.address + '/comments/vote/' + _id, JSON.stringify(data), { headers: _this.headers })
                .map(function (res) { return res.json(); })
                .toPromise()
                .then(function (data) {
                console.log("comment vote success");
                console.log(data);
                return data;
            })
                .catch(function (err) {
                console.log(err);
                console.log("error");
            });
        });
    };
    Pictures.prototype.trashPic = function (_id, userID, reason) {
        var data = {
            "userID": userID,
            "reason": reason,
            "picId": _id
        };
        console.log(_id);
        console.log(userID);
        return this.http.post(this.address + '/pictures/report', JSON.stringify(data), { headers: this.headers })
            .map(function (res) { return res.json(); })
            .toPromise()
            .then(function (data) {
            console.log("pic reported");
            return data;
        })
            .catch(function (err) {
            console.log(err);
            console.log("error");
        });
    };
    return Pictures;
}());
Pictures = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"],
        __WEBPACK_IMPORTED_MODULE_4__user_user__["a" /* User */]
        /*private _jsonp: Jsonp*/
    ])
], Pictures);

//# sourceMappingURL=pictures.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__up_load_pic_up_load_pic__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_feedback_feedback__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_user_user__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_camera_camera__ = __webpack_require__(110);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var MePage = MePage_1 = (function () {
    function MePage(navCtrl, camera, user, feedback, camProvider) {
        this.navCtrl = navCtrl;
        this.camera = camera;
        this.user = user;
        this.feedback = feedback;
        this.camProvider = camProvider;
        // Set profile pic according to user activityStatus
        //assets/avatars_sq/author2.png  or assets/avatars_round/{{user.localUser.data.ActivityStatus}}
        this.percent = 0; //= 100 * this.user.localUser.data.xp / (10 * ((1 + this.user.localUser.data.level / 10) ** 2));
        this.sections = "Profile", "Feedback";
    }
    MePage.prototype.xpPercent = function () {
        //console.log("Showing percentage metre: "+ this.user.localUser.curPercent )
        return { 'width': this.user.localUser.curPercent + '%' }; //return { 'width': this.percent + '%' };
    };
    MePage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // this.user.getLocalUserData();
        //console.log(this.user.localUser);
        console.log(this.user.localUser);
        console.log(this.user.localUser.curPercent);
        this.user.getUserData().then(function (res) {
            _this.xpRequired = (10 * (Math.pow((1 + _this.user.localUser.data.level / 10), 2)));
            _this.percent = Math.round(100 * _this.user.localUser.data.xp / _this.xpRequired);
            _this.xpToNextLvl = Math.round(_this.xpRequired - _this.user.localUser.data.xp);
            console.log(_this.user.localUser.curPercent);
            //this.xpToNextLvl = 100-this.user.localUser.curPercent;
            console.log("XP to next lvl: " + _this.xpToNextLvl);
            _this.countPercent();
            console.log("XP meter: " + _this.percent + '%');
            //  console.log("curP after counter: "+ this.user.localUser.curPercent);
        });
    };
    MePage.prototype.countPercent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var counterTarget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        counterTarget = this.percent;
                        console.log("curP pre counter: " + this.user.localUser.curPercent);
                        console.log("T pre counter: " + counterTarget);
                        if (counterTarget < this.user.localUser.curPercent) {
                            console.log("Set counterTarget to 100"); // jos tullut lvl up jolloin target < curPercent -> ladataan palkki täyteen
                            counterTarget = 100;
                        }
                        _a.label = 1;
                    case 1:
                        if (!(this.user.localUser.curPercent < counterTarget)) return [3 /*break*/, 4];
                        //  console.log("curP in counter: "+ this.user.localUser.curPercent);
                        this.user.localUser.curPercent = this.user.localUser.curPercent + 0.5;
                        this.xpToNextLvl = Math.round(this.xpRequired - (this.xpRequired * (this.user.localUser.curPercent / 100)));
                        //  console.log("curP in counter l2: "+ this.user.localUser.curPercent);
                        return [4 /*yield*/, this.delay(10)];
                    case 2:
                        //  console.log("curP in counter l2: "+ this.user.localUser.curPercent);
                        _a.sent();
                        //  console.log("curP in counter l3: "+ this.user.localUser.curPercent);
                        if (this.user.localUser.curPercent === 100 && counterTarget <= this.user.localUser.curPercent) {
                            console.log("Start loading from 0");
                            counterTarget = this.percent;
                            this.user.localUser.curPercent = 0;
                            console.log("curP after 100: " + this.user.localUser.curPercent);
                            console.log("T after 100: " + counterTarget);
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4:
                        this.xpToNextLvl = Math.round(this.xpRequired - this.user.localUser.data.xp);
                        this.user.storeLocalUser(this.user.localUser);
                        return [2 /*return*/];
                }
            });
        });
    };
    MePage.prototype.delay = function (ms) {
        //  console.log("Delaying: "+ms+" ms")
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    MePage.prototype.pushPage = function (name) {
        var _this = this;
        if (name === "feedi") {
            this.navCtrl.popToRoot();
        }
        else if (name === 'camera') {
            this.camProvider.takePhoto().then(function (res) {
                console.log("CAmera result:");
                console.log(res);
                if (res)
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__up_load_pic_up_load_pic__["a" /* UpLoadPicPage */], res);
            });
        }
        else if (name === 'me') {
            this.navCtrl.push(MePage_1);
        }
    };
    MePage.prototype.popFeedback = function () {
        this.feedback.postFeedback(this.sendFeedback);
        this.navCtrl.popToRoot();
    };
    return MePage;
}());
MePage = MePage_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-me',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\me\me.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <!-- <img id="logoTopNav" src="assets/img/oddogle_small_logo_4-6.png" /> -->\n\n    <img id="logoTopNav" src="assets/img/Logo-2.png" />\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <div id="sections" padding>\n\n    <ion-segment [(ngModel)]="sections">\n\n\n\n      <ion-segment-button value="Profile">\n\n        Profile\n\n      </ion-segment-button>\n\n      <ion-segment-button value="Feedback">\n\n        Feedback\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n  </div>\n\n  <!-- segmentit ryhmitelty ngSwitchillä -->\n\n\n\n\n\n  <div [ngSwitch]="sections">\n\n    <!-- <- POISTA      \n\n    <ion-list class="profilePage" *ngSwitchDefault>\n\n        <h1>Coming soon!</h1>\n\n        <ion-item text-wrap>\n\n          <div id="message">\n\n              We currently developing some awesome features for you.\n\n          </div>\n\n          <div id="construction">\n\n              <img src="assets/img/UnderConstruction.png" />\n\n          </div>\n\n        </ion-item>\n\n      </ion-list>\n\n  POISTA -> -->\n\n\n\n    <ion-list class="profilePage" *ngSwitchDefault>\n\n      <ion-item>\n\n        <div class="avatar">\n\n          <img class="avatarPic" src="assets/avatars_round/{{user.localUser.data.ActivityStatus}}">\n\n        </div>\n\n        <div id="level">\n\n          <div id="levelNumber">\n\n            {{user.localUser.data.level}}\n\n          </div>\n\n          <div id="lvl">LVL</div>\n\n        </div>\n\n        <div class="xp-bar" *ngIf="user">\n\n          <div class="xp" [ngStyle]="xpPercent()"></div>\n\n        </div>\n\n        <div class="xpToNextLevel" *ngIf="user">\n\n          xp to next level: {{xpToNextLvl}}\n\n        </div>\n\n      </ion-item>\n\n      <!--\n\n      <ion-item>\n\n        <div class="bucks" *ngIf="user.localUser">\n\n          <h2 id="bucksH2"> Oddbucks:</h2> <h1 id="usersBucks">{{user.localUser.data.oddBucksBalance}}</h1>\n\n          <img class="oddBucks" src="assets/oddbucks/symbol.png">\n\n        </div>\n\n      </ion-item> -->\n\n\n\n      <ion-item>\n\n        <h2 class="statsTitle">Stats:</h2>\n\n      </ion-item>\n\n\n\n      <ion-item>\n\n        <h3 class="stats">Total score: {{user.localUser.data.points}}</h3>\n\n      </ion-item>\n\n\n\n      <ion-item>\n\n        <h3 class="stats">Posted pics: {{user.localUser.data.picCount}}</h3>\n\n      </ion-item>\n\n\n\n      <ion-item>\n\n        <h3 class="stats">Comments written: {{user.localUser.data.commentCount}}</h3>\n\n      </ion-item>\n\n\n\n      <ion-item>\n\n        <h3 class="stats">Longest comment: {{user.localUser.data.longestComment}}</h3>\n\n      </ion-item>\n\n\n\n    </ion-list>\n\n\n\n\n\n    <ion-list *ngSwitchCase="\'Feedback\'">\n\n      <ion-item class="content">\n\n        <ion-item [(ngModel)]="sendFeedback" id="Feedbacktext">\n\n          <ion-textarea rows="10" placeholder="Give us some feedback!" maxLength="500"></ion-textarea>\n\n\n\n        </ion-item>\n\n        <button (click)="popFeedback();" id="pic-button1" ion-button color="stable" block>\n\n          Send feedback\n\n        </button>\n\n      </ion-item>\n\n    </ion-list>\n\n  </div>\n\n</ion-content>\n\n\n\n<div class="bottomNav">\n\n  <ion-icon class="bNavIcon" name="images" (click)="pushPage(\'feedi\')"></ion-icon>\n\n  <ion-icon class="bNavIcon" name="camera" (click)="pushPage(\'camera\')"></ion-icon>\n\n  <ion-icon class="bNavIcon" name="person"></ion-icon>\n\n</div>\n\n'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\me\me.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_5__providers_user_user__["a" /* User */],
        __WEBPACK_IMPORTED_MODULE_4__providers_feedback_feedback__["a" /* Feedback */],
        __WEBPACK_IMPORTED_MODULE_6__providers_camera_camera__["a" /* CameraProvider */]])
], MePage);

var MePage_1;
//# sourceMappingURL=me.js.map

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UpLoadPicPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_pictures_pictures__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_user__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import firebase from 'firebase';



// import { CamPage } from '../cam/cam';

var UpLoadPicPage = (function () {
    function UpLoadPicPage(navCtrl, navParams, alertCtrl, user, 
        //private http: Http,
        Pictures) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.user = user;
        this.Pictures = Pictures;
        this.uploading = false;
        this.myPhoto = "";
        //pictures = [];
        this.Header = "What is this?";
        this.parameterPic = this.navParams.get('paramPic'); // kuva parametrin maaritys
        this.myPhoto = this.navParams.get('paramData');
        //  this.myPhotosRef = firebase.storage().ref('/Photos/');
        this.parameterPic = "data:image/jpeg;base64," + this.myPhoto;
        this.data = null;
        this.generateFolderName(); // pvm lyempään muotoon
        this.generateUUID(); // generoi random UUID pvm perusteella
        // this.uploadPhoto();
        if (!this.myPhoto)
            this.undefImg();
    }
    // Tekee kansiolle nimen pvm mukaan esim: "2017-12-20"
    UpLoadPicPage.prototype.generateFolderName = function () {
        //var d: string;
        console.log("Push done! upload 2");
        var d = new Date().toISOString().split('T');
        this.fdate = d[0];
        return d[0];
    };
    // generoi randomin UUID:n pvm pohjalta
    UpLoadPicPage.prototype.generateUUID = function () {
        console.log("Push done! upload 3");
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        this.fname = uuid + ".jpeg";
        return uuid;
    };
    UpLoadPicPage.prototype.popView = function () {
        var _this = this;
        // this.getPhotoURL().then((url) => {
        this.uploading = true;
        this.Pictures.postPictures(this.fname, this.Header, this.parameterPic, this.fdate)
            .then(function (res) {
            console.log(res);
            _this.navCtrl.popToRoot(); // palauttaa juuri näkymään
            _this.uploading = false;
        });
        // });
    };
    UpLoadPicPage.prototype.undefImg = function () {
        this.navCtrl.popToRoot(); // palauttaa juuri näkymään
        this.uploading = false;
        var alert = this.alertCtrl.create({
            title: 'Error...',
            subTitle: "Something went wrong with the picture process. If you were taking a photo, you should try again.",
            buttons: [
                {
                    text: "OK",
                    handler: function () {
                        console.log('OK clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    return UpLoadPicPage;
}());
UpLoadPicPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-up-load-pic',template:/*ion-inline-start:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\up-load-pic\up-load-pic.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <img id="logoTopNav" src="assets/img/Logo-2.png"/>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding id="page4">\n\n  <div>\n\n    <!-- Ladataan parametrina saatu kuva  -->\n\n    <img [src]="parameterPic" style="display:block;width:100%;height:auto;margin-left:auto;margin-right:auto;" />\n\n\n\n  </div>\n\n  <ion-list radio-group [(ngModel)]="Header" no-lines>\n\n    <!-- Laittaa vaihtoehdot ryhmaan jolloin vain yhden voi valita, \n\n      no-lines poistaa viivat vaihtoehtojen valeista -->\n\n    <ion-item *ngFor="let title of user.localUser.data.titles" class="title">\n\n      <ion-label>\n\n        {{title}}\n\n      </ion-label>\n\n      <ion-radio value= {{title}}></ion-radio>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n  <button *ngIf="!uploading" (click)="popView();" id="upLoadPic-button2" ion-button color="stable">\n\n    <div id="send">Send</div>\n\n  </button>\n\n  <button *ngIf="uploading" id="upLoadPic-button2" class="opaq" ion-button color="stable">\n\n    <div id="send">Send</div> \n\n  </button>\n\n</ion-content>\n\n\n\n<!--  block (click)="popView();" -->\n\n'/*ion-inline-end:"C:\TC5\Virhe\mainOddOgle\Frontend\src\pages\up-load-pic\up-load-pic.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_user__["a" /* User */],
        __WEBPACK_IMPORTED_MODULE_3__providers_pictures_pictures__["a" /* Pictures */]])
], UpLoadPicPage);

//# sourceMappingURL=up-load-pic.js.map

/***/ })

},[211]);
//# sourceMappingURL=main.js.map