import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-invoices',
  imports: [MatButtonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  async createPdf() {
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

    page.drawText('Order#12345', {
      x: 450,
      y: 780,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Date: March 27, 2025', {
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

    const drinks = [
      { name: 'Coke', quantity: 2, price: 1.5, total: 3 },
      { name: 'Coffee', quantity: 1, price: 2, total: 2 },
      { name: 'Tea', quantity: 1, price: 1.2, total: 1.2 },
    ];
    let yPosition = 670;
    drinks.forEach((drink) => {
      page.drawText(drink.name, {
        x: 50,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(drink.quantity.toString(), {
        x: 200,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${drink.price.toFixed(2)}`, {
        x: 300,
        y: yPosition,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${drink.total.toFixed(2)}`, {
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
    page.drawText('Subtotal: $6.20', {
      x: 50,
      y: yPosition - 40,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Tax: $0.62', {
      x: 50,
      y: yPosition - 60,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Total: $6.82', {
      x: 50,
      y: yPosition - 80,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText('Discount Applied: $5.00', {
      x: 50,
      y: yPosition - 100,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('Contact us: support@ace.com | www.ace.com', {
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
    link.download = 'order#12345.pdf';
    link.click();
  }
}
