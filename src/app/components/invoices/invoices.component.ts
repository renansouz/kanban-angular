import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { DatabaseService } from '../../database.service';
import { invoice } from '../../models/invoice.model';
import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-invoices',
  imports: [],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {
  user: User | null = null;
  private userSubscription!: Subscription;
  orders: invoice[] = [];
  auth = inject(AuthService);
  db = inject(DatabaseService);

  async ngOnInit() {
    this.userSubscription = this.auth.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }

  async loadOrders():Promise<any> {
    if (!this.user) return;

    const orderCollection = this.db.getOrders(this.user.uid);

  }
}
