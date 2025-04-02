import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-product',
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatMenuModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  selectedTabIndex = 0;

  milkHot = 0;
  syrupHot = 0;
  caffeineHot = 0;

  milkCold = 0;
  syrupCold = 0;
  caffeineCold = 0;

  subTotal = 0;
  tax = 0;
  total = 0;

  discount = 0;
  discountApplied = false;

  totalCartItems = 0;

  orderNumber: string | null = null;

  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateSummary();
  }

  incrementHot(type: string) {
    if (type === 'milk') this.milkHot++;
    if (type === 'syrup') this.syrupHot++;
    if (type === 'caffeine') this.caffeineHot++;
    this.updateSummary();
  }

  decrementHot(type: string) {
    if (type === 'milk' && this.milkHot > 0) this.milkHot--;
    if (type === 'syrup' && this.syrupHot > 0) this.syrupHot--;
    if (type === 'caffeine' && this.caffeineHot > 0) this.caffeineHot--;
    this.updateSummary();
  }

  incrementCold(type: string) {
    if (type === 'milk') this.milkCold++;
    if (type === 'syrup') this.syrupCold++;
    if (type === 'caffeine') this.caffeineCold++;
    this.updateSummary();
  }

  decrementCold(type: string) {
    if (type === 'milk' && this.milkCold > 0) this.milkCold--;
    if (type === 'syrup' && this.syrupCold > 0) this.syrupCold--;
    if (type === 'caffeine' && this.caffeineCold > 0) this.caffeineCold--;
    this.updateSummary();
  }

  applyDiscount(code: string) {
    if (code === 'ABC' && this.subTotal > 0) {
      this.discount = 5;
      this.discountApplied = true;
    } else {
      this.discount = 0;
      this.discountApplied = false;
    }
    this.updateSummary();
  }

  updateSummary() {
    const hotSubtotal =
      this.milkHot * 1 + this.syrupHot * 0.5 + this.caffeineHot * 2;
    const coldSubtotal =
      this.milkCold * 1 + this.syrupCold * 0.5 + this.caffeineCold * 2;

    this.subTotal = hotSubtotal + coldSubtotal;
    this.tax = parseFloat((this.subTotal * 0.12).toFixed(2));

    if (this.subTotal === 0) {
      this.discount = 0;
      this.discountApplied = false;
    }

    const discountedSubtotal = Math.max(0, this.subTotal - this.discount);
    this.total = parseFloat((discountedSubtotal + this.tax).toFixed(2));

    this.totalCartItems =
      this.milkHot +
      this.syrupHot +
      this.caffeineHot +
      this.milkCold +
      this.syrupCold +
      this.caffeineCold;
  }

  async placeOrder() {
    const currentUser = this.authService.currentUserSig();
    if (!currentUser) {
      alert('Please log in to place an order.');
      return;
    }

    try {
      const orderData = {
        userId: currentUser.uid,
        subTotal: this.subTotal,
        discount: this.discount,
        tax: this.tax,
        total: this.total,
        milkHot: this.milkHot,
        syrupHot: this.syrupHot,
        caffeineHot: this.caffeineHot,
        milkCold: this.milkCold,
        syrupCold: this.syrupCold,
        caffeineCold: this.caffeineCold,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(this.firestore, 'orders'),
        orderData
      );
      this.orderNumber = 'INV-' + docRef.id.slice(0, 6).toUpperCase();

      this.router.navigate(['/invoices'], {
        queryParams: { order: this.orderNumber },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Could not place the order. Please try again later.');
    }
  }
}
