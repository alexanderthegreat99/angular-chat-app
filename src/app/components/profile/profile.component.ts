import { Component, OnInit} from '@angular/core';
//import { UsersService } from 'src/app/services/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { NgToastService } from 'ng-angular-popup';
import {
  User,
  
} from '@angular/fire/auth';
import { UsersService } from 'src/app/services/users.service';
import { concatMap, switchMap } from 'rxjs';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ProfileUser } from 'src/app/models/user';
//import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user$ = this.usersService.currentUserProfile$;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private toast: NgToastService,
    private fb: NonNullableFormBuilder,
    private usersService: UsersService

 ) {}
  ngOnInit(): void {
    this.usersService.currentUserProfile$
   // .pipe(untilDestroyed(this))
    .subscribe((user) => {
      this.profileForm.patchValue({ ...user});
    })
  }


 uploadImage(event: any, { uid }: ProfileUser){
 
  if(!event.target.files[0]){
    return;
  }
  
  this.imageUploadService.uploadImage(event.target.files[0],`images/profile/${uid}`).pipe(
   // concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL}))
   
   switchMap((photoURL) =>
          this.usersService.updateUser({
            uid,
            photoURL,
          })
        )

  ).subscribe(() => {
    this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Uploaded the Image!', duration: 5000});
  
    
  }, err=>{
    this.toast.error({detail:"ERROR",summary:'Image Upload failed!', duration: 5000})
  });
 }
 saveProfile() {
  const { uid, ...data } = this.profileForm.value;

  if (!uid) {
    return;
  }

  this.usersService
    .updateUser({ uid, ...data })
    .subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'You Sucessfully Updated User Info!', duration: 5000});
    
      
    }, err=>{
      this.toast.error({detail:"ERROR",summary:'User Info Update Failed!', duration: 5000})
    });
   
    
}

}