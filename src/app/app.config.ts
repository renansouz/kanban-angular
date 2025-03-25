import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDsns5ZfejMLhFhkM6JjDP2zXoXfiJ80ko',
  authDomain: 'kanban-op.firebaseapp.com',
  projectId: 'kanban-op',
  storageBucket: 'kanban-op.firebasestorage.app',
  messagingSenderId: '90892657334',
  appId: '1:90892657334:web:43d054204bc931024cfc17',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
};
