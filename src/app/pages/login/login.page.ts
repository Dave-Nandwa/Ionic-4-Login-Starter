import {
  AuthService
} from './../../services/auth.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router,
  RouterModule
} from '@angular/router';
/* ----------------------------- Form Variables ----------------------------- */

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO
} from 'ngx-intl-tel-input';

/* -------------------------------- Services -------------------------------- */


import {
  UtilitiesService
} from './../../services/utilities.service';

/* ---------------------------- Native Providers ---------------------------- */

/* -------------------------------- Firebase -------------------------------- */
import * as firebase from 'firebase/app';
import {
  AlertController
} from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(undefined, Validators.minLength(6))
  });

  constructor(
    private utils: UtilitiesService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController) {}

  ngOnInit() {}

  async forgotPasswordPrompt() {
    const alert = await this.alertController.create({
      header: 'To which email?',
      inputs: [{
        name: 'email',
        type: 'text',
        placeholder: 'Email'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          this.forgotPassword(data.email);
        }
      }]
    });

    await alert.present();
  }


  forgotPassword(email) {
    this.authService.sendPasswordResetEmail(email)
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.UnitedStates, CountryISO.Canada, CountryISO.SouthAfrica];
  }

  logIn() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const form = this.loginForm.value;
    if (!emailRegex.test(form.email)) {
      let err: any = {};
      err.message = 'Invalid Email Address';
      this.utils.handleError(err);
    } else {
      if (form.email && form.password) {
        this.utils.presentLoading('Logging you in...');
        this.authService.loginUser(form.email, form.password).then(() => {
          this.utils.dismissLoading();
          this.utils.presentToast('Authentication Successful.', 'toast-success');
          let user = firebase.auth().currentUser
          this.router.navigate(['tabs/home']);
          // this.setuserInfo(data[0]);
        }).catch((error) => {
          // Handle Errors here.
          this.utils.dismissLoading();
          /* -------------------------------- Log Error ------------------------------- */
          console.log(error);
          this.utils.presentToast("Log In Error.", "toast-error");
          // Display Error Message to User
          this.utils.handleError(error);
        });
      };
    }
  }


  signUp() {
    this.router.navigate(['/sign-up']);
  }


}