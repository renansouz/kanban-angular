import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  private authService = inject(AuthService);
  private router = inject(Router);
  user = signal<User | null>(null);

  async registerWithGoogle(): Promise<void> {
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
