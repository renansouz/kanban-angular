import { inject, Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, addDoc } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

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

  async updateUser(uid: string, updateData: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, updateData);
  }

  async saveOrder(userUid: string, orderData: any): Promise<string> {
    const orderRef = collection(this.firestore, `users/${userUid}/orders`);
    const docRef = await addDoc(orderRef, orderData);
    return `${docRef.id}`;
  }

  async getCouponInfo(couponId: string): Promise<any | null> {
    const couponRef = doc(this.firestore, `coupons/${couponId}`);
    const couponDoc = await getDoc(couponRef);

    if (couponDoc.exists()) {
      return couponDoc.data(); // Return the coupon data
    } else {
      return null; // Return null if coupon does not exist
    }
  }
}
