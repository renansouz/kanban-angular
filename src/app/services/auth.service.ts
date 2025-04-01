import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() {
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUserSig.set({
          uid: user.uid,
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: username })
    );

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  updateUserProfile(
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      return from(Promise.reject(new Error('User not logged in')));
    }
    const promises: Promise<any>[] = [];

    promises.push(updateProfile(user, { displayName: username }));

    if (email && email !== user.email) {
      promises.push(updateEmail(user, email));
    }

    if (password) {
      promises.push(updatePassword(user, password));
    }

    return from(Promise.all(promises).then(() => {}));
  }
}
