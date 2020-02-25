import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UpLoadPicPage } from '../up-load-pic/up-load-pic';
import { Feedback } from '../../providers/feedback/feedback';
import { User } from '../../providers/user/user';
import { CameraProvider } from '../../providers/camera/camera'

@Component({
  selector: 'page-me',
  templateUrl: 'me.html'
})
export class MePage {
  sendFeedback: String;
  sections;
  // Set profile pic according to user activityStatus
  //assets/avatars_sq/author2.png  or assets/avatars_round/{{user.localUser.data.ActivityStatus}}
  percent: number = 0; //= 100 * this.user.localUser.data.xp / (10 * ((1 + this.user.localUser.data.level / 10) ** 2));
  persentString: String; //= this.percent * 100 + "%";
  xpToNextLvl: number; //= Math.round((10 * ((1 + this.user.localUser.data.level / 10) ** 2)) - this.user.localUser.data.xp);
  //curPercent: number = 0;
  xpRequired:number;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private user: User,
    private feedback: Feedback,
    private camProvider: CameraProvider

  ) { /*
    if (login.localUser) {
      login.getUserData();
      this.user = login.localUser;
    } else login.loginPrompt().then((res)=>{
    console.log(res);
    this.user = login.localUser;
    }); */
    this.sections = "Profile", "Feedback";
  }

  xpPercent(): any {
    //console.log("Showing percentage metre: "+ this.user.localUser.curPercent )
    return { 'width': this.user.localUser.curPercent + '%' }; //return { 'width': this.percent + '%' };
  }

  ionViewDidEnter() {
    // this.user.getLocalUserData();
    //console.log(this.user.localUser);
    console.log(this.user.localUser);
    console.log(this.user.localUser.curPercent);
    this.user.getUserData().then(res => {
      this.xpRequired= (10 * ((1 + this.user.localUser.data.level / 10) ** 2));
      this.percent = Math.round(100 * this.user.localUser.data.xp / this.xpRequired);
      this.xpToNextLvl= Math.round(this.xpRequired - this.user.localUser.data.xp);
      console.log(this.user.localUser.curPercent);
      //this.xpToNextLvl = 100-this.user.localUser.curPercent;
      console.log("XP to next lvl: " + this.xpToNextLvl);
      this.countPercent();
      console.log("XP meter: " + this.percent + '%');
      
    //  console.log("curP after counter: "+ this.user.localUser.curPercent);
    });

  }

  async countPercent() {
    var counterTarget = this.percent;
    console.log("curP pre counter: " + this.user.localUser.curPercent);
    console.log("T pre counter: " + counterTarget);
    if (counterTarget < this.user.localUser.curPercent) {
      console.log("Set counterTarget to 100"); // jos tullut lvl up jolloin target < curPercent -> ladataan palkki täyteen
      counterTarget = 100;} 
    for (; this.user.localUser.curPercent < counterTarget;) {
    //  console.log("curP in counter: "+ this.user.localUser.curPercent);

      this.user.localUser.curPercent = this.user.localUser.curPercent + 0.5;
      this.xpToNextLvl = Math.round(this.xpRequired -(this.xpRequired * (this.user.localUser.curPercent/100)));
    //  console.log("curP in counter l2: "+ this.user.localUser.curPercent);
      await this.delay(10);
    //  console.log("curP in counter l3: "+ this.user.localUser.curPercent);
      if (this.user.localUser.curPercent === 100 && counterTarget <= this.user.localUser.curPercent) {  // kun curP = 100 ja target on pienenmpi
        console.log("Start loading from 0");
        counterTarget = this.percent;
        this.user.localUser.curPercent = 0;
        console.log("curP after 100: " + this.user.localUser.curPercent);
        console.log("T after 100: " + counterTarget);
      }
   //   console.log(this.user.localUser);
    }
    this.xpToNextLvl= Math.round(this.xpRequired - this.user.localUser.data.xp);
    this.user.storeLocalUser(this.user.localUser);
  }

  delay(ms: number) {
  //  console.log("Delaying: "+ms+" ms")
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pushPage(name) {
    if (name === "feedi") {
      this.navCtrl.popToRoot();
    } else if (name === 'camera') {
      this.camProvider.takePhoto().then(res => {
        console.log("CAmera result:");
        console.log(res);
        if (res) this.navCtrl.push(UpLoadPicPage, res);
      });
    } else if (name === 'me') {
      this.navCtrl.push(MePage);
    }
  }

  popFeedback() {
    this.feedback.postFeedback(this.sendFeedback);
    this.navCtrl.popToRoot();
  }
}
