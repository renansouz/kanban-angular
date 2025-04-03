import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    username: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/.{8,}/),
      ],
    ],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/').then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          this.errorMessage = this.getErrorMessage(error.code);
        },
      });
  }

  getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests':
        'Too many login attempts. Please try again later.',
      'validation/username-invalid':
        'Username can only contain letters, numbers, and underscores.',
      'validation/password-invalid':
        'Password must be at least 8 characters long.',
    };

    return (
      errorMessages[errorCode] ||
      'An unexpected error occurred. Please try again.'
    );
  }

  onGoogleLogin(): void {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.router.navigateByUrl('/').then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.errorMessage = this.getErrorMessage(error.code);
      },
    });
  }
}
