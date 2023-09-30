import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Unsubcriber } from '../../classes/unsubcriber';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Unsubcriber implements OnInit  {
 
  RegisterForm: FormGroup;
  loginForm: FormGroup;
  loadingRegister : boolean = false;
  loadingLogin : boolean = false;
  login : boolean = true;
  register : boolean = false;
  ShowPassword: boolean = false;

  

  constructor(private fb: FormBuilder, private authService: AuthService,private route :Router) {
    super();
    this.RegisterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      role: ['ROLE_USER', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    })
  }

  get firstName() { return this.RegisterForm.get('firstName'); }
  get lastName() { return this.RegisterForm.get('lastName'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get email() { return this.RegisterForm.get('email'); }
  get password() { return this.RegisterForm.get('password'); }

  get emailLogin() { return this.loginForm.get('email'); }
  get passwordLogin() { return this.loginForm.get('password'); }

  ngOnInit(): void {
    
  }



  switchRegister(){
    this.login  = false;
    this.register = true;
  }
  switchLogin(){
    this.login  = true;
    this.register = false;
  }

  PasswordShowFunction() {
    this.ShowPassword = !this.ShowPassword
    let password = document.getElementById("password")
    if (this.ShowPassword == true) {
      // @ts-ignore
      password.type = "text"
    } else {
      // @ts-ignore
      password.type = "password"
    }
  }

  registerSubmit(){
     this.loadingRegister = true;
     this.anotherSubscription = this.authService.register(this.RegisterForm.value).subscribe(response => {
             this.loadingRegister = false;
             this.route.navigate(["/dashboard/tasks"])
     },error => {
      this.loadingLogin = false;
    });
  }
  loginSubmit(){
    this.loadingLogin = true;
    this.anotherSubscription = this.authService.login(this.loginForm.value).subscribe(response => {
            this.loadingLogin = false;
            this.route.navigate(["/dashboard/tasks"])
    },error => {
      this.loadingLogin = false;
    });
 }
  
}
