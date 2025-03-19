import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth.service';
import { User, Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private router = inject(Router);
  userInfo = signal<User | null>(null);
  private unsubscribeAuthState: (() => void) | null = null;

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
