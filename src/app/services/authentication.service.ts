import { Injectable } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
  UserInfo,
  UserCredential,
} from '@angular/fire/auth';
import { concatMap, from, Observable, of, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  currentUser$ = authState(this.auth);
  constructor(private auth: Auth) { 
    authState(this.auth).subscribe((response)=>{
      console.log("auth: "+response);
    });
  }
  
  login(username:string, password: string){
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }
  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
      const user = this.auth.currentUser;
      return of(user).pipe(
        concatMap((user) => {
          if (!user) throw new Error('Not authenticated');
  
          return updateProfile(user, profileData);
        })
      );
    }
  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    return from(this.auth.signOut());
  }
}