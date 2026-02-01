---
name: product-messaging
description: Firebase Cloud Messaging for push notifications with service workers
---

# Cloud Messaging

Firebase Cloud Messaging (FCM) enables push notifications by registering devices with unique tokens.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideMessaging(() => getMessaging()),
  ],
};
```

## Service Worker Setup

Create `src/assets/firebase-messaging-sw.js`:

```javascript
// Use the same Firebase version as your app
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-sw.js";

const firebaseApp = initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
});

const messaging = getMessaging(firebaseApp);
```

## FCM Service

```typescript
import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage, deleteToken } from '@angular/fire/messaging';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FcmService {
  private messaging = inject(Messaging);
  message$: Observable<any>;

  constructor() {
    this.initializeMessaging();
  }

  private async initializeMessaging() {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      await this.registerServiceWorker();
    } else {
      console.log('Notification permission denied');
    }

    // Listen for foreground messages
    this.message$ = new Observable(subscriber => 
      onMessage(this.messaging, message => subscriber.next(message))
    ).pipe(
      tap(message => {
        console.log('Received foreground message:', message);
        // Handle foreground message (show toast, update UI, etc.)
      })
    );
  }

  private async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register(
        '/assets/firebase-messaging-sw.js',
        { type: 'module' }
      );

      const token = await getToken(this.messaging, {
        vapidKey: 'your-vapid-key', // Generate in Firebase Console
        serviceWorkerRegistration: registration,
      });

      console.log('FCM Token:', token);
      // Store token in your database for sending notifications
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      throw error;
    }
  }

  async deleteToken() {
    await deleteToken(this.messaging);
    // Also remove token from your database
  }
}
```

## Component Integration

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FcmService } from './fcm.service';

@Component({
  template: `
    <button (click)="subscribeToNotifications()">Enable Notifications</button>
    
    @if (latestMessage) {
      <div class="notification">
        <h4>{{ latestMessage.notification?.title }}</h4>
        <p>{{ latestMessage.notification?.body }}</p>
      </div>
    }
  `
})
export class Notifications implements OnInit {
  private fcmService = inject(FcmService);
  latestMessage: any = signal(null);

  constructor() {
    this.fcmService.message$.subscribe(message => {
      this.latestMessage = message;
    });
  }

  subscribeToNotifications(): void {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications enabled');
      }
    });
  }
}
```

## Storing FCM Tokens

Store tokens with user data for targeted notifications:

```typescript
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Messaging, getToken } from '@angular/fire/messaging';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private messaging = inject(Messaging);

  async saveTokenToUser() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(this.messaging, {
      vapidKey: 'your-vapid-key',
      serviceWorkerRegistration: registration,
    });

    // Store token in user document
    const userDoc = doc(this.firestore, `users/${currentUser.uid}`);
    await updateDoc(userDoc, {
      fcmToken: token,
      fcmTokenUpdatedAt: new Date()
    });
  }
}
```

## Sending Notifications (Cloud Function)

Example Cloud Function to send notifications:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendNotification = functions.https.onCall(async (data, context) => {
  const { userId, title, body } = data;

  // Get user's FCM token from Firestore
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();
  
  const fcmToken = userDoc.data()?.fcmToken;
  if (!fcmToken) {
    throw new functions.https.HttpsError('not-found', 'User has no FCM token');
  }

  const message = {
    notification: { title, body },
    token: fcmToken,
  };

  await admin.messaging().send(message);
  return { success: true };
});

// Trigger notification on document creation
export const onNewMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.data();
    const recipientId = messageData.recipientId;

    const userDoc = await admin.firestore()
      .collection('users')
      .doc(recipientId)
      .get();
    
    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) return;

    await admin.messaging().send({
      notification: {
        title: 'New Message',
        body: messageData.text.substring(0, 100),
      },
      token: fcmToken,
    });
  });
```

## Handling Different Message Types

```typescript
// Foreground messages - app is open
onMessage(this.messaging, (payload) => {
  console.log('Foreground message:', payload);
  // Show in-app notification, toast, etc.
});

// Background messages are handled by the service worker
// Customize in firebase-messaging-sw.js
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/messaging.md
- https://firebase.google.com/docs/cloud-messaging/js/client
- https://firebase.google.com/docs/reference/js/messaging
-->
