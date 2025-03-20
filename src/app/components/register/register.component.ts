import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  private authService = inject(AuthService);

  nameControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  lastNameControl = new FormControl('', {nonNullable: true, validators: [Validators.required]});
  emailControl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  confirmEmailControl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  passwordControl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] });
  confirmPasswordControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  matchPasswords(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value 
      ? null 
      : { notMatching: true };
  }

  async registerWithGoogle() {
    const user = await this.authService.loginWithGoogle();
    if (user) {
      console.log('User registered:', user);
    }
  }

  async register() {
    if (
      this.nameControl.valid &&
      this.emailControl.valid &&
      this.confirmEmailControl.valid &&
      this.passwordControl.valid &&
      this.confirmPasswordControl.valid
    ) {
      const name = this.nameControl.value;
      const email = this.emailControl.value;
      const password = this.passwordControl.value;

      await this.authService.registerWithEmail(email, password, name);
    }
  }
}

