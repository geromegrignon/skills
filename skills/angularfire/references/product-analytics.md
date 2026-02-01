---
name: product-analytics
description: Firebase Analytics integration with automatic and custom event tracking
---

# Firebase Analytics

Google Analytics provides insight on app usage and user engagement, with automatic Angular Router integration.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideAnalytics(() => getAnalytics()),
  ],
};
```

## Injecting Analytics

```typescript
import { Component, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';

@Component({...})
export class Analytics {
  private analytics = inject(Analytics);
}
```

## Logging Events

### Custom Events

```typescript
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({...})
export class Tracking {
  private analytics = inject(Analytics);

  trackButtonClick(buttonName: string): void {
    logEvent(this.analytics, 'button_click', {
      button_name: buttonName,
      timestamp: Date.now()
    });
  }

  trackPurchase(item: string, value: number): void {
    logEvent(this.analytics, 'purchase', {
      item_name: item,
      value: value,
      currency: 'USD'
    });
  }

  trackSearch(searchTerm: string, resultsCount: number): void {
    logEvent(this.analytics, 'search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }
}
```

### Standard Events

Firebase Analytics has predefined events with specific parameters:

```typescript
import { Analytics, logEvent } from '@angular/fire/analytics';

// Screen view
logEvent(this.analytics, 'screen_view', {
  firebase_screen: 'Dashboard',
  firebase_screen_class: 'DashboardComponent'
});

// Sign up
logEvent(this.analytics, 'sign_up', {
  method: 'Google'
});

// Login
logEvent(this.analytics, 'login', {
  method: 'Email'
});

// Share
logEvent(this.analytics, 'share', {
  content_type: 'article',
  item_id: 'article_123'
});

// Add to cart
logEvent(this.analytics, 'add_to_cart', {
  currency: 'USD',
  value: 29.99,
  items: [{ item_id: 'SKU_123', item_name: 'Product Name' }]
});
```

## User Properties

Set user properties for segmentation:

```typescript
import { Analytics, setUserProperties, setUserId } from '@angular/fire/analytics';

@Component({...})
export class User {
  private analytics = inject(Analytics);

  setUserInfo(user: { id: string; plan: string; region: string }) {
    // Set user ID
    setUserId(this.analytics, user.id);

    // Set custom user properties
    setUserProperties(this.analytics, {
      subscription_plan: user.plan,
      user_region: user.region
    });
  }
}
```

## Screen Tracking Service

Create a service for automatic screen tracking:

```typescript
import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics = inject(Analytics);
  private router = inject(Router);

  constructor() {
    this.trackPageViews();
  }

  private trackPageViews() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      logEvent(this.analytics, 'page_view', {
        page_path: event.urlAfterRedirects,
        page_title: document.title
      });
    });
  }

  trackEvent(eventName: string, params?: Record<string, any>) {
    logEvent(this.analytics, eventName, params);
  }
}
```

## Directive for Click Tracking

```typescript
import { Directive, HostListener, Input, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Directive({
  selector: '[trackClick]'
})
export class TrackClickDirective {
  private analytics = inject(Analytics);

  eventName = input<string>('click', {
    alias: 'trackClick'
  });

  trackParams = input<Record<string, any>>({});

  @HostListener('click')
  onClick(): void {
    logEvent(this.analytics, this.eventName(), this.trackParams());
  }
}

// Usage in template:
// <button trackClick="cta_click" [trackParams]="{ button_id: 'signup' }">
//   Sign Up
// </button>
```

## Analytics with Authentication

Track user actions with auth context:

```typescript
import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent, setUserId } from '@angular/fire/analytics';
import { Auth, user } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthAnalyticsService {
  private analytics = inject(Analytics);
  private auth = inject(Auth);

  constructor() {
    // Update analytics user ID when auth state changes
    user(this.auth).subscribe(currentUser => {
      if (currentUser) {
        setUserId(this.analytics, currentUser.uid);
        logEvent(this.analytics, 'user_authenticated', {
          method: currentUser.providerData[0]?.providerId
        });
      } else {
        setUserId(this.analytics, '');
      }
    });
  }
}
```

## Automatic Tracking Services

AngularFire provides built-in services for automatic tracking.

### ScreenTrackingService

Automatically tracks screen views when navigating with Angular Router:

```typescript
import { provideAnalytics, getAnalytics, ScreenTrackingService } from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService, // Add this service
  ],
};
```

The service automatically logs `screen_view` events with:
- Screen name (from route path)
- Screen class (from component selector)
- Page path and title
- Previous screen information

### UserTrackingService

Automatically sets the Analytics user ID based on Firebase Auth state:

```typescript
import { 
  provideAnalytics, getAnalytics, 
  ScreenTrackingService, UserTrackingService 
} from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService, // Automatically syncs auth user ID
  ],
};
```

When a user signs in or out, the service automatically calls `setUserId()` with the user's UID.

## Consent Mode

Handle user consent for analytics:

```typescript
import { Analytics, setAnalyticsCollectionEnabled } from '@angular/fire/analytics';

@Component({...})
export class ConsentComponent {
  private analytics = inject(Analytics);

  // Enable/disable analytics collection based on user consent
  updateConsent(hasConsent: boolean) {
    setAnalyticsCollectionEnabled(this.analytics, hasConsent);
  }
}
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/analytics.md
- https://github.com/angular/angularfire/blob/main/src/analytics/screen-tracking.service.ts
- https://github.com/angular/angularfire/blob/main/src/analytics/user-tracking.service.ts
- https://firebase.google.com/docs/analytics/get-started
- https://firebase.google.com/docs/reference/js/analytics
-->
