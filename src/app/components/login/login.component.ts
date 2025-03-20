import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../auth.service';
import { User } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private authService = inject(AuthService);
  user = signal<User | null>(null);

  async loginWithEmailandPassword(): Promise<void> { 
    try {
      const userCredential = await this.authService.loginWithEmail(this.email, this.password);
      console.log('Logged in:', userCredential.user);
      this.user.set(userCredential.user);
    } catch (error: any) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message); // Show an alert for debugging
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle().then((user) => {
        console.log('Logged in', user) // Logging for debugging purposes
      }); 
    } catch (error) {
      console.error(error);
    }    
  }
}
