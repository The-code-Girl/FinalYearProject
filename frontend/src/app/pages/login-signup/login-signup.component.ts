import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from './../../services/user.service';
import { FormDisplay } from './FormDisplay';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent implements OnInit {
  logged: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  signup: FormDisplay = {
    greeting: 'Create an Account',
    linkPrompt: 'Already have an account?',
    link: 'Login',
    submit: 'Sign Up',
    img: '../../assets/login-signup/signup.svg',
    slogan: 'join the movement, change the world',
  };

  login: FormDisplay = {
    greeting: 'Welcome Back',
    linkPrompt: "Don't have an account?",
    link: 'Sign Up',
    submit: 'Log In',
    img: '../../assets/login-signup/login.svg',
    slogan: 'a system you can rely on',
  };

  form: FormDisplay = this.signup;

  email: string = '';
  username: string = '';
  password: string = '';
  type: string = '';
  error: string = '';

  onToggle() {
    this.logged = !this.logged;
    this.form = this.logged ? this.login : this.signup;
  }

  loginHandler(user: any) {
    this.userService.loginUser(user.email, user.password).subscribe(
      (res) => {
        if (res === false) {
          console.log('incorrect password');
          this.error = "Error: Invalid Password"
        } else {
          this.userService.setUser(<User>res);
          this.router.navigate(['dashboard']);
        }
      },
      (err) => {
        console.log(err.error)
        this.error = err.error;
      }
    );
  }

  registerHandler(user: any) {
    if (!user.type) return;

    // logs student in
    this.userService.postNewUser(user).subscribe(
      (res) => {
        this.userService.setUser(res);
        console.log('Register success!');
        console.log('Navigating to questionnaire');
        if (user.type === 'IC') {
          this.router.navigate(['questionnaire']);
        } else if (user.type === 'SI') {
          this.router.navigate(['questionnaire2']);
        } else {
          this.router.navigate(['dashboard']);
        }
      },
      (err) => {
        console.log(err.error);
        this.error = err.error?.message || "An error occurred during registration";
        if (!err.error || !err.error.message) {
          this.error = "Error: An unknown error occurred";
        }
        return;
      }
    );
  }

  onSubmit() {
    const user = {
      _id: this.username,
      email: this.email,
      password: this.password,
      type: this.type, // Make sure type is set
    };
    if (!this.logged) {
      if (!user.type) {
        console.error("Error: User type not provided");
        return;
      }
      this.registerHandler(user);
    } else {
      this.loginHandler(user);
    }
  }

  ngOnInit(): void {
    if (!!this.userService.getCurrentUser()) {
      this.router.navigate(['dashboard']);
    }
  }
}

