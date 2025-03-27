import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-product',
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  formVisible = false;
  formLabel = '';
  selectedType: string | null = null;
  milk = 0;
  syrup = 0;
  caffeine = 0;
  subTotal = 0;
  total = 0;
  tax = 0;
  orderSummary: boolean = false;
  discountCode: string = '';
  discountApplied: boolean = false;
  discount: number = 0;
  totalCartItems = 0;

  showForm(type: string) {
    this.formVisible = true;
    this.formLabel = type === 'hot' ? 'Hot Drink' : 'Cold Drink';
    this.selectedType = type;
  }

  increment(type: string) {
    if (type === 'milk') {
      this.milk++;
    } else if (type === 'syrup') {
      this.syrup++;
    } else if (type === 'caffeine') {
      this.caffeine++;
    }
    this.saveToLocalStorage();
  }
  decrement(type: string) {
    if (type === 'milk') {
      this.milk--;
    } else if (type === 'syrup') {
      this.syrup--;
    } else if (type === 'caffeine') {
      this.caffeine--;
    }
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    this.subTotal = this.milk + this.syrup / 2 + this.caffeine * 2;
    this.tax = parseFloat((this.subTotal * 0.12).toFixed(2));
    this.total = parseFloat(
      (this.subTotal + this.tax - this.discount).toFixed(2)
    );
    this.totalCartItems = this.milk + this.syrup + this.caffeine;

    const data = {
      selectedType: this.selectedType,
      milk: this.milk,
      syrup: this.syrup,
      caffeine: this.caffeine,
      subTotal: this.subTotal,
      tax: this.tax,
      total: this.total,
      totalCartItems: this.totalCartItems,
    };
    localStorage.setItem('drinkOrder', JSON.stringify(data));
  }

  applyDiscount(discountCode: string) {
    if (discountCode === 'ABC') {
      this.discount = 5;
      this.discountApplied = true;
      this.saveToLocalStorage();
    } else {
      this.discountApplied = false;
      this.discount = 0;
    }
  }
}
