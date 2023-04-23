import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgToastService } from 'ng-angular-popup';

import { Router } from '@angular/router';
//import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
  })
  
  constructor(private authService: AuthenticationService, private router: Router, private toast: NgToastService){}
  ngOnInit() {
   
  }
  get registerFormControl() {
    return this.loginForm.controls;
  }
  loginFn(){
    const { email, password } = this.loginForm.value;
    if(!this.loginForm.valid || !email || !password){
      return;
    }
    
    this.authService.login( email, password).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Logged In!', duration: 5000});
      
      this.router.navigate(['/home']);
    }, err=>{
      this.toast.error({detail:"ERROR",summary:'Login failed! Try again.', duration: 5000})
    });
    this.authService.currentUser$.subscribe((user) => {
      console.log('Current user:', user);
    });
   console.log(this.loginForm.value);
    console.log(this.loginForm);
    this.loginForm.reset();
  }
  

}