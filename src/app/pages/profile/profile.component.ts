import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  form = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.pattern(/.{8,}/)]],
  });

  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    const currentUser = this.authService.currentUserSig();
    if (currentUser) {
      this.form.patchValue({
        username: currentUser.username,
        email: currentUser.email,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      this.successMessage = '';
      return;
    }

    const { username, email, password } = this.form.value;
    this.authService
      .updateUserProfile(username || '', email || '', password || '')
      .subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully.';
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Error updating profile. Please try again.';
          this.successMessage = '';
          console.error('Error updating profile:', error);
        },
      });
  }
}
