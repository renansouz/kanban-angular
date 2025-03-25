import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-products',
  imports: [MatRadioModule, FormsModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  hotCoffee: boolean = false;
  caffeine: boolean = true;
  milkCount: number = 0;
  syrupCount: number = 0;

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

  orderCoffee() {
    alert('Order: \n' +
      (this.hotCoffee ? 'Hot' : 'Cold') + '\n' +
      'Milk: ' + this.milkCount + '\n' +
      'Sugar: ' + this.syrupCount + '\n' +
      'Caffeine: ' + (this.caffeine ? 'Yes' : 'No'));
  }
}
