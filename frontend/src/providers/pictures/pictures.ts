import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
//import { JwtHelper } from "angular2-jwt";
import { User } from "../user/user"
// 8.11.2017
//import { Jsonp } from '@angular/http';

@Injectable()
export class Pictures {
  data: any;
  dataLocal: any;
  public pictureList = [];
  public loading: boolean;
  feedType: string = "default";

  //address = "https://oddogleapis.com";
  // address = "http://10.0.1.39:3000";
  address = "https://dev.oddogleapis.com";


  constructor(
    public http: Http,
    // private jwtHelper: JwtHelper,
    private user: User
    /*private _jsonp: Jsonp*/
  ) {
    this.data = null;
    this.dataLocal = null;
  }
  private headers = new Headers({ 'Content-Type': 'application/json' });

  loadFeed(): Promise<any> {
    this.loading = true;
    //  console.log(this.login.localUser);
    // Hae kuvat ja niiden data
    var date
    if (this.pictureList.length > 0) { // jos on jo ennestään haetaan vain uudet kuvat
      date = this.pictureList[0].dateTime
    return this.getNewPictures(date).then((data) => {
        var tempArray;
        console.log("Number of new pics: " + data.length);
        if (data.length == 0) { this.loading = false; return; } // jos ei tulekaan uusia kuvia
        console.log(data);
        tempArray = data;
        for (var n = 0; n < tempArray.length; n++) {
          this.pictureList.unshift(tempArray[n]);
        }
        //this.pictureList=this.tempArray;
        this.pictureList = this.checkForHaters(this.pictureList);
        this.loading = false;
      });
    } else { // jos kuvia ei ennestään haetaan viimeisimmät
      console.log("Get feed..");
    return this.getPictures(this.feedType).then((data) => {
        console.log(data);
        this.pictureList = data;
        this.pictureList = this.checkForHaters(this.pictureList);
        // kun feedi haettu tarkista käyttäjäs
        this.loading = false;
      });
    }
  }

  extendPictures(): Promise<any> {
    this.loading = true;
    if (this.pictureList.length == 0) {
      this.loadFeed();
      return new Promise(resolve => { resolve(); });
    }
    console.log((this.pictureList[this.pictureList.length - 1].dateTime));
    return this.getOlderPictures(this.pictureList[this.pictureList.length - 1].dateTime).then((data) => {
      console.log("Number of older pics: " + data.length);
      console.log(data);
      for (var n = 0; n < data.length; n++) {
        this.pictureList.push(data[n]);
      }
      console.log(this.pictureList);
      this.pictureList = this.checkForHaters(this.pictureList);
      this.loading = false;
    });
  }

  checkForHaters(array): any[] {
    console.log("User: "+ this.user.localUser.data.userID);
    console.log("Array length: "+array.length);
    if (this.user.localUser && this.user.localUser.data.userID ) { // && this.user.localUser.data.userID != "Guest"
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
              if (i >0) {
                i--;
              }
            }
          }
        }
      }
    }
    console.log("User: "+ this.user.localUser.data.userID);
    return array;
  }


  // http://localhost:3000/comments
  // http://46.101.110.105:3000/comments/
  getPictures(type): Promise<any> {
    return new Promise(resolve => {
      // for users own pictures add userID to url
      if(type==="myPics" || type==="followedPics"){
        type = type +"&" + this.user.localUser.data.userID;
      }
      this.http.get(this.address + '/pictures/' + type)
        .map(res => res.json())
        .subscribe(data => {
          //console.log(data);
          resolve(data);
        });
    });
  }


  getNewPictures(date): Promise<any> {
    if (this.feedType === "default") {
      return new Promise(resolve => {
        this.http.get(this.address + '/pictures/new/' + date)
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            //console.log(data);
            resolve(data);
          });
      });
    } else {
      return new Promise(resolve => { resolve({}); });
    }
  }

  getOlderPictures(date): Promise<any> {
    if (this.feedType === "default") {
      return new Promise(resolve => {
        this.http.get(this.address + '/pictures/more/' + date)
          .map(res => res.json())
          .subscribe(data => {
            //console.log(data);
            resolve(data);
          });
      });
    } else {
      return new Promise(resolve => { resolve({}); });
    }
  }

  getPicture(_id): Promise<any> {
    //  console.log('https://oddogleapis.com/pictures/' + _id);
    return new Promise(resolve => {
      this.http.get(this.address + '/picture/' + _id + "&" + this.user.localUser.data.userID) //tällä kestää aikaa, tapahtuu kun kerkee
        .map(res => res.json())
        .subscribe(dataLocal => {
          resolve(dataLocal);
        });
    });
  }


  postPictures(fname, Header, picture, fdate): Promise<any> {
    return this.user.checkTokenValidity().then(res => {
      var data = {
        'pic': picture,
        'title': Header,
        'name': fname,
        'date': fdate,
        'token': this.user.localUser.token
      }
      //   console.log('http://46.101.110.105:3000/pictures' + fname + Header + flink + fdate)
      return this.http.post(this.address + '/postPicture', JSON.stringify(data), { headers: this.headers })
        //  .map((res: any) => res.json())
        .toPromise()
        .then(data => {
          console.log("picture posted");
          return data;
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    });
  }

  postComment(pic_id, sendComment): Promise<any> {
    return this.user.checkTokenValidity().then(res => {
      var data = {
        'id': pic_id,
        'comment': sendComment,
        'token': this.user.localUser.token,
        'curLongestComment': this.user.localUser.data.longestComment
      }
      // console.log('http://46.101.110.105:3000/comments/' + _id + sendComment)
      return this.http.put(this.address + '/postComment', JSON.stringify(data), { headers: this.headers })
        .map((res: any) => res.json())
        .toPromise()
        .then(data => {
          console.log("comment posted");
          return data;
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    });
  }


  votePic(_id, ud, reVoter): Promise<any> { //ud = up/down
    return this.user.checkTokenValidity().then(res => {
      console.log("token check done???!!?!?");
      var data = {
        "type": ud,
        "token": this.user.localUser.token,
        "reVoter": reVoter
      }
      console.log(_id);
      console.log(data);
      //console.log(userID);
      return this.http.put(this.address + '/pictures/vote/' + _id, JSON.stringify(data), { headers: this.headers })
        .map((res: any) => res.json())
        .toPromise()
        .then(data => {
          //console.log("mäoontäällä");
          return data;
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    });
  }

  voteCom(_id, ud, pId, reVoter): Promise<any> { //ud = up/down
    return this.user.checkTokenValidity().then(res => {
      var data = {
        "type": ud,
        "picId": pId,
        "token": this.user.localUser.token,
        "reVoter": reVoter
      }
      console.log("Token checked and ok to use!")
      console.log(_id);
      console.log(data);
      return this.http.put(this.address + '/comments/vote/' + _id, JSON.stringify(data), { headers: this.headers })
        .map((res: any) => res.json())
        .toPromise()
        .then(data => {
          console.log("comment vote success");
          console.log(data);

          return data;
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    });
  }

  trashPic(_id, userID, reason): Promise<any> { //ud = up/down
    var data = {
      "userID": userID,
      "reason": reason,
      "picId": _id
    }
    console.log(_id);
    console.log(userID);
    return this.http.post(this.address + '/pictures/report', JSON.stringify(data), { headers: this.headers })
      .map((res: any) => res.json())
      .toPromise()
      .then(data => {
        console.log("pic reported");
        return data;
      })
      .catch((err) => {
        console.log(err);
        console.log("error");
      });
  }

} 