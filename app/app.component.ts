import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent], // Only import NavbarComponent
  template: `
    <navbar></navbar> <!-- Now Navbar contains everything -->
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
