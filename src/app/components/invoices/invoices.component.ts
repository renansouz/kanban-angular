import { Component, inject } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { DatabaseService } from '../../database.service';
import { invoice } from '../../models/invoice.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { jsPDF } from 'jspdf';

@Component({
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(5px)' }),
        animate('0.3s ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  selector: 'app-invoices',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {
  user: User | null = null;
  private userSubscription!: Subscription;
  orders: invoice[] = [];
  ordersLoaded = false;
  auth = inject(AuthService);
  db = inject(DatabaseService);

  async ngOnInit() {
    this.userSubscription = this.auth.getCurrentUser().subscribe(async user => {
      this.user = user;
      if (this.user) {
        this.orders = await this.loadOrders();
        this.orders.sort((a, b) => Number(a.date) + Number(b.date));
        this.ordersLoaded = true;
      }
    });
  }

  ngOnDestroy() {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }

  async loadOrders(): Promise<invoice[]> {
    if (!this.user) return [];
    return await this.db.getOrders(this.user.uid);
  }

  formattedDate(date: number): string {
    return new Date(date).toLocaleString(); // Converts timestamp to readable format
  }
  
  generatePdf(invoice: invoice) {
    const doc = new jsPDF();
    
    // Add invoice title
    doc.setFontSize(18);
    doc.text('Kanban-NG Coffee', 105, 20, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.orderNumber}`, 20, 40);
    doc.text(`Date: ${this.formattedDate(Number(invoice.date))}`, 20, 50);
    
    // Add items table
    let y = 80;
    doc.text('Item', 20, y);
    doc.text('Price', 100, y);
    doc.text('Qty', 140, y);
    doc.text('Total', 180, y);
    y += 10;
    
    // Add total
    y += 10;
    doc.setFontSize(14);
    doc.text(`Subtotal: $${invoice.subTotal.toFixed(2)}`, 20, y);
    y += 10;
    if (invoice.discount > 0) {
      doc.text(`Discount: -$${invoice.discount.toFixed(2)}`, 20, y);
      y += 10;
    }
    doc.text(`Tax: $${invoice.tax.toFixed(2)}`, 20, y);
    y += 10;
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 20, y);
    y += 10;
    
    // Save the PDF
    doc.save(`invoice_${invoice.orderNumber}.pdf`);
  }

}
