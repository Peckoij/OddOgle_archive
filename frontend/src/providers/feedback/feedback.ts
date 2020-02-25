import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { User } from '../user/user';


@Injectable()
export class Feedback {
    data: any;
    
    constructor(
      public http: Http,
      private user:User
    ) {}
    
      private headers = new Headers({ 'Content-Type': 'application/json' });

      
    postFeedback(sendFeedback) {
        var data = { 
          'text': sendFeedback,
          'userID':this.user.localUser.data.userID  
        }
        console.log(data)
        this.http.post(this.user.address+'/feedback', JSON.stringify(data), { headers: this.headers })
          .map((res: any) =>  
            res.json())
          .subscribe(
            err => console.log(err));  
    }

}  