import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../../auth.service';
import { User } from 'firebase/auth';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-products',
  imports: [MatRadioModule, FormsModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription!: Subscription;
  priceSubscription!: Subscription;
  auth = inject(AuthService);
  db = inject(DatabaseService);
  
  coffeePrice$ = new BehaviorSubject<number>(2.0);
  gst$ = new BehaviorSubject<number>(5.0);
  pst$ = new BehaviorSubject<number>(7.0);
  hotCoffee: boolean = false;
  caffeine: boolean = true;
  milkPrice$ = new BehaviorSubject<number>(0.8);
  syrupPrice$ = new BehaviorSubject<number>(0.3);
  milkCount$ = new BehaviorSubject<number>(0);
  syrupCount$ = new BehaviorSubject<number>(0);
  discount$ = new BehaviorSubject<number>(0.0);

  couponId: string = '';
  subTotal: number = 2.0;
  tax: number = 0.0;
  total: number = 0.0;
  


  ngOnInit() {
    // Subscribe to auth user
    this.userSubscription = this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    // Subscribe to price updates
    this.priceSubscription = combineLatest([
      this.coffeePrice$,
      this.milkCount$,
      this.syrupCount$,
      this.milkPrice$,
      this.syrupPrice$,
      this.discount$,
      this.gst$,
      this.pst$
    ]).subscribe(([coffeePrice, milkCount, syrupCount, milkPrice, syrupPrice, discount, gst, pst]) => {
      this.updatePrice(coffeePrice, milkCount, syrupCount, milkPrice, syrupPrice, discount, gst, pst);
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.priceSubscription?.unsubscribe();
  }


  decrementMilk(): void {
    this.milkCount$.next(Math.max(0, this.milkCount$.value - 1));
  }

  incrementMilk(): void {
    this.milkCount$.next(this.milkCount$.value + 1);
  }

  decrementSyrup(): void {
    this.syrupCount$.next(Math.max(0, this.syrupCount$.value - 1));
  }

  incrementSyrup(): void {
    this.syrupCount$.next(this.syrupCount$.value + 1);
  }

  async checkCoupon() {
    try {
      const couponData = await this.db.getCouponInfo(this.couponId);
      if (couponData) {
        this.discount$.next(couponData.discount);
      } else {
        console.log('Coupon not found');
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  }

  updatePrice(
    coffeePrice: number,
    milkCount: number,
    syrupCount: number,
    milkPrice: number,
    syrupPrice: number,
    discount: number,
    gst: number,
    pst: number
  ): void {
    let subTotal = coffeePrice + (milkCount * milkPrice) + (syrupCount * syrupPrice);
    let discountAmount = subTotal * (discount / 100);
    subTotal -= discountAmount;
    let tax = subTotal * ((pst / 100) + (gst / 100));
    let total = subTotal + tax;

    this.subTotal = parseFloat(subTotal.toFixed(2));
    this.tax = parseFloat(tax.toFixed(2));
    this.total = parseFloat(total.toFixed(2));

    console.log(
      'Subtotal:', this.subTotal, 
      '\nDiscount:', discountAmount.toFixed(2),
      '\nTax:', this.tax,
      '\nTotal:', this.total
    );
  }

  async orderCoffee() { 
    try {
      if (this.user) {
        const orderData = {
          hot: this.hotCoffee,
          caffeine: this.caffeine,
          milkCount: this.milkCount$.value,
          syrupCount: this.syrupCount$.value,
          discount: this.discount$.value,
          subTotal: this.subTotal,
          total: this.total,
          tax: this.tax,
          date: Date.now(),
          orderNumber: this.generateOrderNumber()
        }
        const orderId = await this.db.saveOrder(this.user.uid, orderData);
        alert(orderId + '\n Order placed' +
          'Subtotal: ' + this.subTotal + 
          '\nDiscount: ' + this.discount$.value +
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
