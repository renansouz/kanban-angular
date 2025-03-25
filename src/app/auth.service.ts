import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User, onAuthStateChanged, EmailAuthProvider, linkWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential
  
 } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private provider = new GoogleAuthProvider();
  private dbService = inject(DatabaseService);
  private router = inject(Router);

  async loginWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle(): Promise<User | null> {
    try {
      const userCred = await signInWithPopup(this.auth, this.provider);
      const user = userCred.user;

      if (user) {
        // Fetch user from Firestore
        const existingUser = await this.dbService.getUser(user.uid);

        // If new user, add to Firestore
        if (!existingUser) {
          await this.dbService.addUser(user.uid, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            hasPassword: false, // Track if user has a password
            createdAt: new Date()
          });
        }

        // Redirect to "Set Password" if needed
        if (!existingUser?.hasPassword) {
          this.router.navigate(['/set-password']);
        } else {
          this.router.navigate(['dashboard']);
        }
      }

      return user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return null;
    }
  }

  async setPassword(password: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const credential = EmailAuthProvider.credential(user.email!, password);
    await linkWithCredential(user, credential);

    // Update Firestore user record
    await this.dbService.updateUser(user.uid, { hasPassword: true });

    this.router.navigate(['/dashboard']);
  }

  async registerWithEmail(email: string, password: string, name: string): Promise<User | null> {
    try {
      const userCred = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCred.user;

      // Store user in Firestore
      await this.dbService.addUser(user.uid, {
        displayName: name,
        email: user.email,
        hasPassword: true,
        createdAt: new Date()
      });

      return user;
    } catch (error) {
      console.error('Email Registration Error:', error);
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
