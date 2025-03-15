import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private auth: Auth) {}

  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then((user) => {
      console.log('User:', user);
    });
  }

  logout() {
    signOut(this.auth);
  }
}
