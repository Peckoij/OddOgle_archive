import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Storage } from "@ionic/storage"; // login credentiaalien tallennus
import { GooglePlus } from '@ionic-native/google-plus';
import { JwtHelper } from "angular2-jwt";
import { AlertController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class User {
  loginCred: any;
  userId: any;
  guestUser = {
    data: {
      ActivityStatus: "guide.png",
      level: 0,
      oddBucksBalance: 0,
      points: 0,
      userID: "Guest",
      xp: 0,
      longestComment: 0,
      fcmPermissions:{
        newComments:false
      }
    },
    refreshToken: null,
    token: null,
    curPercent: 0,
    deviceToken: "",
  }
  localUser = this.guestUser;
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: Http,
    private googlePlus: GooglePlus,
    private jwtHelper: JwtHelper,
    private storage: Storage,
    private alertCtrl: AlertController,
    private firebase: Firebase
  ) {
  /*
    this.firebase.getToken()
    .then(token => console.log(token)) // save the token server-side and use it to push notifications to this device
    .catch(error => console.error('Error getting token', error));
  
  this.firebase.onTokenRefresh()
    .subscribe((token: string) => console.log(token));
  // */

  }
  // backend adress
  //  address = "https://oddogleapis.com";
  //address = "http://10.0.1.39:3000";
  address = "https://dev.oddogleapis.com";



  // Enable notifications fro new comments
  enableNotifications(){
    this.firebase.onTokenRefresh()
    .subscribe((token: string) =>  {
      console.log(token)
      this.localUser.deviceToken= token;
      this.sendNotificationToken(token);
    });
  }

  // Add token to user
  sendNotificationToken(token): Promise<any>{
    return this.checkTokenValidity().then(res => {
      var data = {
        'deviceToken': this.localUser.deviceToken,
        'token': this.localUser.token
      }
      return this.http.put(this.address + '/updateFCMToken', JSON.stringify(data), { headers: this.headers })
        .map((res: any) => res.json())
        .toPromise()
        .then(data => {
          console.log("FCM token posted");
          console.log(data);
          this.localUser.deviceToken=data.deviceToken;
          this.storeLocalUser(this.localUser);
          return data;
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    });
  }

  // Toggle notification type on/off
  // possible types: newComments, newFollowed
  // possible values: true / false
  toggleNotificationType(type, value){
    return this.checkTokenValidity().then(res => {
      var data = {
        'token': this.localUser.token,
        'type': type,
        'value': value
      }
      return this.http.post(this.address + '/toggleNotificationType', JSON.stringify(data), { headers: this.headers })
        .map((res: any) => res.json())
        .toPromise()
        .then(data => {
          console.log("Permissions setting changed");
          console.log(data);
          this.localUser.data.fcmPermissions[data.type]=data.value;
          //this.localUser.fcmPermissions=data.deviceToken;
          this.storeLocalUser(this.localUser);
          return data;
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    });
  }



  // Alert, presented if not logged in when trying to publish something (post pic, comment etc)
  loginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Login required',
      message:
        "This action requires user account, please login to continue current action. You may continue using application without login but you can't take pictures, comment, vote or access profile page. <br> <br> Your google login is used only for authentication. Your personal data is not stored nor shown to other users. ",
      buttons: [
        {
          text: "Read more",
          handler: () => {
            console.log('read more clicked');
            window.open('https://www.oddogle.com/terms-of-service/');
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log('Cancel clicked');
            this.localUser = this.guestUser;
          }
        }, {
          text: "Login with google",
          handler: () => {
            console.log('Login clicked');
            this.googleSilentLogin();
          }

        }
      ]
    });
    alert.present();
  }


  // Alert, presented if not logged in when app opens
  loginAlertSoft() {
    let alert = this.alertCtrl.create({
      title: 'Do you want to login?',
      message: "This action requires user account, please login to continue current action. You may continue using application without login but you can't take pictures, comment, vote or access profile page. <br> <br> Your google login is used only for authentication. Your personal data is not stored nor shown to other users. ",
      buttons: [
        {
          text: "Read more",
          handler: () => {
            console.log('read more clicked');
            window.open('https://www.oddogle.com/terms-of-service/');
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log('Cancel clicked');
            this.localUser = this.guestUser;
          }
        }, {
          text: "Login with google",
          handler: () => {
            console.log('Login clicked');
            this.googleSilentLogin();
          }
        }
      ]
    });
    alert.present();
  }

  /* ---  Functions for (google) logins etc --- */

  // Login with google account and save userId locally
  // also get user data for that id (or create new account)
  googleLogin(): Promise<any> {
    console.log("trying regular login ");
    return this.googlePlus.login({
      // 'androidClientId': 'AIzaSyCMVRCFWxZsT_rEgKm7V1KVy5GLkqmLm6E'
      'webClientId': '323555438273-s6v7hjv7nn260sraj2d8vi5lesqhjen6.apps.googleusercontent.com'
      // ,'offline': false
    })
      .then(res => {
        // if success, save userId to local storage
        //this.storeUserId(res);
        console.log(res);
        this.authenticateUser(res.idToken);
      })
      .catch(err => {
        console.log("Error occured during login, try again?");
        console.error(err);
      });
  }

  // Google silent login if needed
  googleSilentLogin(): Promise<any> {
    console.log("trying silent login ");
    return this.googlePlus.trySilentLogin({
      //  'androidClientId': 'AIzaSyCMVRCFWxZsT_rEgKm7V1KVy5GLkqmLm6E'
      'webClientId': '323555438273-s6v7hjv7nn260sraj2d8vi5lesqhjen6.apps.googleusercontent.com'
    })
      .then(res => {
        // if success, get user data from server
        //  this.storeUserId(res);
        console.log("silent login success");
        //console.log(res);
        return this.authenticateUser(res.idToken);
      })
      .catch(err => {
        console.error(err);
        console.log("silent login failed, trying regular login");
        // if silent login fails, use regular login
        return this.googleLogin();
      });
  }

  // save user data to local storage
  storeLocalUser(data) {
    this.localUser = data;
    this.storage.set('localUser', data);
    //console.log(this.localUser);
  }

  // logout and remove userdata from local storage
  googleLogout() {
    this.localUser = this.guestUser;
    this.googlePlus.logout()
      .then(res => {
        console.log(res);
        //this.userId = "";
        //this.storage.remove('userId');
        // this.localUser = "";
        this.storage.remove('localUser');
      })
      .catch(err => {
        console.error(err);
        //this.userId = "";
        //this.storage.remove('userId');
        //   this.localUser = "";
        this.storage.remove('localUser');
      });
  }

  // Get userdata from backend/DB for user logged in
  // needs google id token
  authenticateUser(token): Promise<any> {
    var data = {
      id_token: token
    }
    //console.log(data)
    return this.http.post(this.address + '/authUser', JSON.stringify(data), { headers: this.headers })
      .map(res => res.json())
      .toPromise()
      .then(data => {
        this.localUser = data;
        console.log("User authenticated & data acquired from server.");
        console.log(this.localUser);
        this.localUser.curPercent = 0;
        this.storeLocalUser(this.localUser);
        return;
      })
      .catch(error => {
        console.log(error);
        return;// error.json();
      });
  }

  // get data from local storage
  getLocalUserData() {
    this.storage.ready().then(() => {
      this.storage.get('localUser').then(res => {
        if (res && res.data.userID != "Guest") {
          console.log("Local user loaded!");
          this.localUser = res;
          console.log(this.localUser);
          if (this.localUser.token === null) { // if token null, ask to login
            this.loginAlertSoft();
          }
        } else {
          console.log("No localUser, login required")
          this.loginAlertSoft();
        }
      }).catch(console.log);
    });
  }

  // Make sure token is valid for atleast 1 minute,
  // if not refresh token using refreshToken
  checkTokenValidity(): Promise<any> {

    var lToken = this.jwtHelper.decodeToken(this.localUser.token);
    var curTime = (Date.now() / 1000);
    curTime = curTime + 60;
    //console.log("Current time: " + curTime);
    //console.log("Exp time: " + lToken.exp);
    if (lToken.exp <= curTime) {
      console.log("Token expired / about to expire. Time to get new.");
      //console.log(this.localUser);
      return this.refreshToken()
        .then(res => {
          if (res) this.checkTokenValidity(); //
          else { // if refresh fails login using google and get new tokens
            console.log("Token refresh failed, login using google.");
            return this.googleSilentLogin().then(res => {
              this.checkTokenValidity();
            });
          }
        });
    } else {
      console.log("Token OK to use.");
      //return empty promise to resolve succesfull validity check
      return new Promise(resolve => { resolve(); });
    }
    //this.checkTokenValidity();'

  }

  refreshToken(): Promise<any> {
    if (this.localUser.token && this.localUser.refreshToken) {
      var data = {
        token: this.localUser.token,
        refreshToken: this.localUser.refreshToken
      }
      //console.log(data)
      return this.http.post(this.address + '/token', JSON.stringify(data), { headers: this.headers })
        .map(res => res.json())
        .toPromise()
        .then(data => {
          //console.log(lToken);
          this.localUser.token = data.token;
          console.log("User token updated");
          console.log(this.localUser);
          return true;
        })
        .catch(error => {
          console.log("Token update failed with error:");
          console.log(error);
          //this.googleSilentLogin();// error.json()
          return false;
        });
    } else {
      return new Promise(resolve => { resolve(); });
    }
  }


  getUserData(): Promise<any> {
    return this.checkTokenValidity().then(res => { //});
      console.log("Sending request for user data");
      var data = {
        token: this.localUser.token
      };
      //console.log(data);      
      return this.http.post(this.address + '/getUser', JSON.stringify(data), { headers: this.headers })
        .map(res => res.json())
        .toPromise()
        .then(data => {
          this.localUser.data = data;
          if (!this.localUser.curPercent) {
            console.log("Set cur Percent to 0");
            this.localUser.curPercent = 0;
          }
          console.log("User data acquired from server.");
          console.log(this.localUser);
          this.storeLocalUser(this.localUser);
        })
        .catch(error => {
          console.log(error);
          // return;// error.json();
        });
    });
  }




  /* // Oldish registration system, currentry not in use 
    register(name, password, email, age, gender, terms): Promise<any> {
    var data = {
      'userID': name,
      'password': password,
      'email': email,
      'age': age,
      'gender': gender,
      // 'points' : 0,
      'termsAccepted': terms
    }
    // console.log('http://46.101.110.105:3001/user' + name + password + email + age + gender);
    return this.http.post('http://localhost:3001/user', JSON.stringify(data), { headers: this.headers })
      // .map((res: any) => res.json())
      .toPromise()
      .then(status => {
        //this.loginCred = loginCred;
        console.log(status);
        return status.json();
      })
      .catch(error => {
        console.log(error);
        return error.json();
      });
  }

  login(userID, password): Promise<any> {
    var data = {
      'userID': userID,
      'password': password
    }
    console.log(data);
    //  return new Promise(resolve => {    
    return this.http.post('http://localhost:3001/authenticate/', JSON.stringify(data), { headers: this.headers })
      //  .map(res => res.json())
      .toPromise()
      .then(loginCred => {
        //this.loginCred = loginCred;
        console.log(loginCred);
        return loginCred.json();
      })
      .catch(error => {
        console.log(error);
        return error.json();
      });
    // });
  }
  // */
}