import { Pictures } from './../../providers/pictures/pictures';
import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../providers/user/user';

@Component({
  selector: 'page-comment-form',
  templateUrl: 'comment-form.html',
})
export class CommentFormPage {
  public commentForm: FormGroup;
  private picId;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private user: User,
    private viewCtrl: ViewController,
    private pictures: Pictures,

  ) {
    this.picId = this.navParams.get('pId');
    // luodaan formi 
    this.commentForm = this.formBuilder.group({
      // ---- username input ja sen ehdot
      comment: ['', Validators.compose([
        Validators.maxLength(500),
        Validators.minLength(0),
        Validators.required
      ])]
    });
    console.log("comment page constr");
  }

  logForm() {
    console.log(this.commentForm.value)
    this.pictures.postComment(
      this.picId,
      this.commentForm.value.comment
    ).then(res => {
      console.log(res);
      this.viewCtrl.dismiss();
      return res;
      
    });
  }

  validation_messages = {
    'comment': [
      { type: 'required', message: 'Comment is required.' },
      { type: 'minlength', message: 'Comment is too short.' },
      { type: 'maxlength', message: 'Comment is too long.' }
    ]
  }

  popView() {
    this.navCtrl.pop();
  }

}
