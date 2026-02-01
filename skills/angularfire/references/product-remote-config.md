---
name: product-remote-config
description: Firebase Remote Config for feature flags and dynamic app configuration
---

# Remote Config

Firebase Remote Config lets you change app behavior and appearance without requiring users to download an app update.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideRemoteConfig(() => getRemoteConfig()),
  ],
};
```

## Injecting Remote Config

```typescript
import { Component, inject } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';

@Component({...})
export class ConfigComponent {
  private remoteConfig = inject(RemoteConfig);
}
```

## Fetching and Activating Config

```typescript
import { 
  RemoteConfig, 
  fetchAndActivate, 
  getValue, 
  getAll,
  getString,
  getNumber,
  getBoolean
} from '@angular/fire/remote-config';

@Component({...})
export class FeatureFlagsComponent {
  private remoteConfig = inject(RemoteConfig);

  async loadConfig() {
    // Fetch and activate in one call
    await fetchAndActivate(this.remoteConfig);

    // Get individual values
    const welcomeMessage = getString(this.remoteConfig, 'welcome_message');
    const maxItems = getNumber(this.remoteConfig, 'max_items');
    const featureEnabled = getBoolean(this.remoteConfig, 'new_feature_enabled');

    // Get all config values
    const allConfig = getAll(this.remoteConfig);
    
    console.log('Config loaded:', { welcomeMessage, maxItems, featureEnabled });
  }
}
```

## Setting Default Values

Set defaults that apply before fetch completes or when offline:

```typescript
import { RemoteConfig, fetchAndActivate } from '@angular/fire/remote-config';

@Component({...})
export class ConfigComponent {
  private remoteConfig = inject(RemoteConfig);

  constructor() {
    // Set default values
    this.remoteConfig.defaultConfig = {
      welcome_message: 'Welcome to our app!',
      max_items: 10,
      new_feature_enabled: false,
      theme_color: '#3498db'
    };
  }

  async initConfig() {
    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (error) {
      console.log('Using default config:', error);
    }
  }
}
```

## Remote Config Service

```typescript
import { Injectable, inject } from '@angular/core';
import { 
  RemoteConfig, 
  fetchAndActivate,
  getString,
  getNumber,
  getBoolean,
  getValue
} from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private remoteConfig = inject(RemoteConfig);
  private initialized = false;

  constructor() {
    this.remoteConfig.defaultConfig = {
      enable_dark_mode: false,
      max_upload_size_mb: 5,
      api_base_url: 'https://api.example.com',
      maintenance_mode: false
    };

    // Set fetch settings
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 3600000, // 1 hour
      fetchTimeoutMillis: 60000 // 60 seconds
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await fetchAndActivate(this.remoteConfig);
      this.initialized = true;
    } catch (error) {
      console.warn('Remote config fetch failed, using defaults:', error);
    }
  }

  isFeatureEnabled(key: string): boolean {
    return getBoolean(this.remoteConfig, key);
  }

  getConfigString(key: string): string {
    return getString(this.remoteConfig, key);
  }

  getConfigNumber(key: string): number {
    return getNumber(this.remoteConfig, key);
  }

  getConfigJson<T>(key: string): T | null {
    try {
      const value = getValue(this.remoteConfig, key);
      return JSON.parse(value.asString()) as T;
    } catch {
      return null;
    }
  }
}
```

## Using in Components

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';

@Component({
  template: `
    @if (darkModeEnabled) {
      <div class="dark-theme">Dark mode content</div>
    }
    
    @if (newFeatureEnabled) {
      <app-new-feature />
    }
    
    <p>Max upload: {{ maxUploadSize }}MB</p>
  `
})
export class AppComponent implements OnInit {
  private featureFlags = inject(FeatureFlagService);
  
  darkModeEnabled = false;
  newFeatureEnabled = false;
  maxUploadSize = 5;

  async ngOnInit() {
    await this.featureFlags.initialize();
    
    this.darkModeEnabled = this.featureFlags.isFeatureEnabled('enable_dark_mode');
    this.newFeatureEnabled = this.featureFlags.isFeatureEnabled('new_feature_enabled');
    this.maxUploadSize = this.featureFlags.getConfigNumber('max_upload_size_mb');
  }
}
```

## Conditional Feature Loading

```typescript
import { Injectable, inject } from '@angular/core';
import { FeatureFlagService } from './feature-flag.service';

@Injectable({ providedIn: 'root' })
export class FeatureGuard {
  private featureFlags = inject(FeatureFlagService);

  async canActivate(route: any): Promise<boolean> {
    await this.featureFlags.initialize();
    
    const requiredFeature = route.data?.requiredFeature;
    if (!requiredFeature) return true;
    
    return this.featureFlags.isFeatureEnabled(requiredFeature);
  }
}

// Route configuration
const routes: Routes = [
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canActivate: [FeatureGuard],
    data: { requiredFeature: 'beta_feature_enabled' }
  }
];
```

## A/B Testing Pattern

```typescript
@Component({...})
export class ABTestComponent implements OnInit {
  private featureFlags = inject(FeatureFlagService);
  variant: 'control' | 'variant_a' | 'variant_b' = 'control';

  async ngOnInit() {
    await this.featureFlags.initialize();
    
    // Get assigned variant from Remote Config
    const assignedVariant = this.featureFlags.getConfigString('checkout_button_variant');
    
    if (['control', 'variant_a', 'variant_b'].includes(assignedVariant)) {
      this.variant = assignedVariant as any;
    }
  }
}
```

## Fetch Intervals

Configure how often the SDK fetches new values:

```typescript
// In development - fetch frequently
this.remoteConfig.settings = {
  minimumFetchIntervalMillis: 0, // Fetch every time
};

// In production - respect server throttling
this.remoteConfig.settings = {
  minimumFetchIntervalMillis: 43200000, // 12 hours
};
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/remote-config.md
- https://firebase.google.com/docs/remote-config/get-started
- https://firebase.google.com/docs/reference/js/remote-config
-->
