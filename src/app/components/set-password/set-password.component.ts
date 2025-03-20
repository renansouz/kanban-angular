import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  passwordForm: FormGroup;

  constructor() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.matchPasswords });
  }

  // Custom validator to check if passwords match
  matchPasswords(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value 
      ? null 
      : { notMatching: true };
  }

  async submit() {
    if (this.passwordForm.valid) {
      await this.authService.setPassword(this.passwordForm.value.password);
    }
  }
}
