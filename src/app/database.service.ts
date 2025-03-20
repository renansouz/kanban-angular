import { inject, Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore = inject(Firestore)

  async addUser(uid: string, userData: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, userData, { merge: true });
  }

  async getUser(uid: string): Promise<any | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  }

  // ✅ Update user data in Firestore
  async updateUser(uid: string, updateData: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, updateData);
  }
}
