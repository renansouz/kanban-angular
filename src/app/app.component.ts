import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatSidenavModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private router: Router) {}

  ngOnInit() {
    // Close drawer when route changes (including browser back/forward)
    this.router.events.subscribe(() => {
      if (this.drawer) {
        this.drawer.close();
      }
    });
  }

  // Method to handle manual button clicks
  closeDrawerOnNavigation() {
    if (this.drawer) {
      this.drawer.close();
    }
  }
}
