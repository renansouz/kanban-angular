import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-invoices',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  orders: any[] = [];

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async ngOnInit() {
    await this.fetchOrders();
  }

  async fetchOrders() {
    const currentUser = this.authService.currentUserSig();
    if (!currentUser) {
      console.log('user not found');
      return;
    }

    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    this.orders = [];
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      orderData['id'] = doc.id;
      orderData['orderNumber'] = 'INV-' + doc.id.slice(0, 6).toUpperCase();
      this.orders.push(orderData);
    });

    this.orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPdf(order: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const logoUrl =
      'https://derpicdn.net/avatars/2014/10/22/17_18_23_625_covericon.png';
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);
    page.drawImage(logoImage, {
      x: 50,
      y: 750,
      width: 50,
      height: 50,
    });

    page.drawText('Ace', {
      x: 110,
      y: 780,
      size: 18,
      font: boldFont,
      color: rgb(0, 0.2, 0.8),
    });
    page.drawText('build your favorite drink!', {
      x: 110,
      y: 760,
      size: 14,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(order.orderNumber, {
      x: 450,
      y: 780,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    const orderDate = new Date(order.createdAt);
    const dateStr = orderDate.toLocaleDateString();
    page.drawText('Date: ' + dateStr, {
      x: 450,
      y: 760,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('Ordered Drinks', {
      x: 50,
      y: 710,
      size: 14,
      font: boldFont,
      color: rgb(0, 0.2, 0.8),
    });
    page.drawText('Item', {
      x: 50,
      y: 690,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Qty', {
      x: 200,
      y: 690,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Unit Price', {
      x: 300,
      y: 690,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Total', {
      x: 400,
      y: 690,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    const items = [];
    if (order.milkHot)
      items.push({ name: 'Milk (Hot)', quantity: order.milkHot, unitPrice: 1 });
    if (order.syrupHot)
      items.push({
        name: 'Syrup (Hot)',
        quantity: order.syrupHot,
        unitPrice: 0.5,
      });
    if (order.caffeineHot)
      items.push({
        name: 'Caffeine (Hot)',
        quantity: order.caffeineHot,
        unitPrice: 2,
      });
    if (order.milkCold)
      items.push({
        name: 'Milk (Cold)',
        quantity: order.milkCold,
        unitPrice: 1,
      });
    if (order.syrupCold)
      items.push({
        name: 'Syrup (Cold)',
        quantity: order.syrupCold,
        unitPrice: 0.5,
      });
    if (order.caffeineCold)
      items.push({
        name: 'Caffeine (Cold)',
        quantity: order.caffeineCold,
        unitPrice: 2,
      });

    let yPosition = 670;
    items.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      page.drawText(item.name, {
        x: 50,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(item.quantity.toString(), {
        x: 200,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${item.unitPrice.toFixed(2)}`, {
        x: 300,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${itemTotal.toFixed(2)}`, {
        x: 400,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    });

    page.drawText('Order Summary', {
      x: 50,
      y: yPosition - 20,
      size: 14,
      font: boldFont,
      color: rgb(0, 0.2, 0.8),
    });
    page.drawText(`Subtotal: $${order.subTotal.toFixed(2)}`, {
      x: 50,
      y: yPosition - 40,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Tax: $${order.tax.toFixed(2)}`, {
      x: 50,
      y: yPosition - 60,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Total: $${order.total.toFixed(2)}`, {
      x: 50,
      y: yPosition - 80,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    if (order.discountApplied) {
      page.drawText(`Discount Applied: $${order.discount.toFixed(2)}`, {
        x: 50,
        y: yPosition - 100,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }

    page.drawText('Contact us: support@ace.com | www.ng-ace.com', {
      x: 50,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.orderNumber}.pdf`;
    link.click();
  }
}
