import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AuthService} from '@core/http';
import {Router} from '@angular/router';

@Component({
  selector: 'ng-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
  
  }

  form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    rememberMe: new FormControl(false),
  });

  ngOnInit(): void {
  }

  onSubmit() {
    const formValue = this.form.value;
    if (this.form.valid) {
      this.authService
        .login({
          username: formValue.username, password: formValue.password,
        })
        .subscribe((res: any) => {
          if (res?.data) {
         
              localStorage.setItem('token', res.data.auth);
            
            this.router.navigate(['/operator']);
          }
        });
    }
  }
}
