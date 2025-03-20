import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth.service';
import { User, Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, FormsModule, MatIconModule, MatSidenavModule, MatDrawer],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private router = inject(Router);
  userInfo = signal<User | null>(null);
  private unsubscribeAuthState: (() => void) | null = null;

  @Input() drawer!: MatDrawer; // Receive the drawer reference

  toggleDrawer() {
    this.drawer.toggle();
  }

  ngOnInit() {
      this.unsubscribeAuthState = onAuthStateChanged(this.auth, (user) => {
        this.userInfo.set(user);
      });
  }

  logout() {
    this.authService.logout().then(() => console.log('Logged out')); // Logging for debugging purposes
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
      if (this.unsubscribeAuthState) {
        this.unsubscribeAuthState();
      }
  }
}
