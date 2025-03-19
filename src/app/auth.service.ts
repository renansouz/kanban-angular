import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private provider = new GoogleAuthProvider();

  async loginWithGoogle(): Promise<User | null> {
    try {
      const userCred = await signInWithPopup(this.auth, this.provider);
      return userCred.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        subscriber.next(user);
      });

      return () => unsubscribe(); // Unsubscribe on cleanup
    });
  }
}
