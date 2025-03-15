import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

import { environment } from '../../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: environment.firebaseConfig.projectId, 
      appId: environment.firebaseConfig.appId, 
      storageBucket: environment.firebaseConfig.storageBucket, 
      apiKey: environment.firebaseConfig.apiKey, 
      authDomain: environment.firebaseConfig.authDomain, 
      messagingSenderId: environment.firebaseConfig.messagingSenderId, 
      measurementId: environment.firebaseConfig.measurementId 
    })), 
    provideAuth(() => getAuth()), 
    provideAnalytics(() => getAnalytics()), 
    ScreenTrackingService, 
    UserTrackingService,
    provideFirestore(() => getFirestore()), 
    provideDatabase(() => getDatabase()), 
    provideFunctions(() => getFunctions()), 
    provideMessaging(() => getMessaging()), 
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()), 
    provideVertexAI(() => getVertexAI())
  ]
};
