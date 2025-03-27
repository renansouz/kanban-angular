import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../../auth.service';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-products',
  imports: [MatRadioModule, FormsModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  user: User | null = null;
  private userSubscription!: Subscription;
  auth = inject(AuthService);
  db = inject(DatabaseService);
  
  coffeePrice: number = 2.0;
  gst: number = 5.0;
  pst: number = 7.0;
  milkPrice: number = 0.8;
  syrupPrice: number = 0.3;
  hotCoffee: boolean = false;
  caffeine: boolean = true;
  milkCount: number = 0;
  syrupCount: number = 0;
  discount: number = 0.0;
  couponId: string = '';
  subTotal: number = 2.0;
  tax: number = 0.0;
  total: number = 0.0;
  


  ngOnInit() {
    this.userSubscription = this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }

  decrementMilk(): void {
    this.milkCount >= 0 ? this.milkCount-- : this.milkCount;
  }

  incrementMilk(): void {
    this.milkCount++;
  }

  decrementSyrup() {
    this.syrupCount >= 0 ? this.syrupCount-- : this.syrupCount;
  }

  incrementSyrup() {
    this.syrupCount++;
  }

  async checkCoupon() {
    try {
      const couponData = await this.db.getCouponInfo(this.couponId);
      if (couponData) {
        this.discount = couponData.discount;
        this.updatePrice();
      } else {
        console.log('Coupon not found');
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  }

  updatePrice(): void {
    this.subTotal = this.coffeePrice + (this.milkCount * this.milkPrice) + (this.syrupCount + this.syrupPrice);
    this.discount = this.subTotal * (this.discount / 100);
    this.subTotal = this.subTotal - this.discount;
    this.tax = this.subTotal * ((this.pst / 100) + (this.gst / 100));
    this.total = this.tax + this.subTotal;
    this.subTotal = parseFloat(this.subTotal.toFixed(2));
    this.discount = parseFloat(this.discount.toFixed(2));
    this.tax = parseFloat(this.tax.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));
    console.log(
      'Subtotal: ' + this.subTotal + 
      '\nDiscount: ' + this.discount +
      '\nTax: ' + this.tax +
      '\nTotal: ' + this.total
    );
  }

  async orderCoffee() { 
    try {
      if (this.user) {
        const orderData = {
          hot: this.hotCoffee,
          caffeine: this.caffeine,
          milkCount: this.milkCount,
          syrupCount: this.syrupCount,
          discount: this.discount,
          subTotal: this.subTotal,
          total: this.total,
          tax: this.tax,
          date: Date.now(),
          orderNumber: this.generateOrderNumber()
        }
        const orderId = await this.db.saveOrder(this.user.uid, orderData);
        alert(orderId + '\n Order placed' +
          'Subtotal: ' + this.subTotal + 
          '\nDiscount: ' + this.discount +
          '\nTax: ' + this.tax +
          '\nTotal: ' + this.total
        );
      }
    } catch (error) {
      alert('Error placing order: ' + error);
    }
  }

  generateOrderNumber(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 2-digit month
    const day = now.getDate().toString().padStart(2, '0'); // 2-digit day
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return parseInt(`${year}${month}${day}${randomNum}`);
  }
  
}
