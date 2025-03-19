import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../auth.service';
import { User } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private authService = inject(AuthService);
  private router = inject(Router);
  user = signal<User | null>(null);



  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle().then((user) => {
        console.log('Logged in', user) // Logging for debugging purposes  
        this.router.navigate(['/dashboard']);
      }); 
    } catch (error) {
      console.error(error);
    }    
  }
}
