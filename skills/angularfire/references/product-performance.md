---
name: product-performance
description: Firebase Performance Monitoring for tracking app performance metrics
---

# Performance Monitoring

Firebase Performance Monitoring helps you gain insight into your app's performance characteristics.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { providePerformance, getPerformance } from '@angular/fire/performance';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    providePerformance(() => getPerformance()),
  ],
};
```

## Injecting Performance

```typescript
import { Component, inject } from '@angular/core';
import { Performance } from '@angular/fire/performance';

@Component({...})
export class Performance {
  private performance = inject(Performance);
}
```

## Automatic Traces

Once initialized, Performance Monitoring automatically collects:
- **Page load traces** - Time to first paint, first contentful paint, DOM interactive
- **Network request traces** - Response time for HTTP requests
- **Screen rendering** - Frame timing metrics

## Custom Traces

Track specific operations with custom traces:

```typescript
import { Performance, trace } from '@angular/fire/performance';

@Component({...})
export class App {
  private performance = inject(Performance);

  async loadData() {
    // Create and start a trace
    const dataTrace = trace(this.performance, 'load_user_data');
    dataTrace.start();

    try {
      // Operation to measure
      const data = await this.fetchUserData();
      
      // Add custom attributes
      dataTrace.putAttribute('user_count', String(data.length));
      dataTrace.putAttribute('data_source', 'api');
      
      // Add custom metrics
      dataTrace.putMetric('items_loaded', data.length);
      
      return data;
    } finally {
      // Always stop the trace
      dataTrace.stop();
    }
  }
}
```

## Performance Service

```typescript
import { Injectable, inject } from '@angular/core';
import { Performance, trace } from '@angular/fire/performance';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private performance = inject(Performance);

  async measureAsync<T>(
    traceName: string, 
    operation: () => Promise<T>,
    attributes?: Record<string, string>
  ): Promise<T> {
    const perfTrace = trace(this.performance, traceName);
    perfTrace.start();

    // Add attributes
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        perfTrace.putAttribute(key, value);
      });
    }

    try {
      const result = await operation();
      perfTrace.putAttribute('success', 'true');
      return result;
    } catch (error) {
      perfTrace.putAttribute('success', 'false');
      perfTrace.putAttribute('error', String(error));
      throw error;
    } finally {
      perfTrace.stop();
    }
  }

  measureSync<T>(
    traceName: string, 
    operation: () => T
  ): T {
    const perfTrace = trace(this.performance, traceName);
    perfTrace.start();

    try {
      return operation();
    } finally {
      perfTrace.stop();
    }
  }
}
```

## Tracing HTTP Requests

Trace API calls for performance insights:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Performance, trace } from '@angular/fire/performance';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private performance = inject(Performance);

  get<T>(url: string): Observable<T> {
    const apiTrace = trace(this.performance, `api_get_${this.getTraceName(url)}`);
    apiTrace.start();
    apiTrace.putAttribute('url', url);
    apiTrace.putAttribute('method', 'GET');

    return this.http.get<T>(url).pipe(
      tap({
        next: () => apiTrace.putAttribute('status', 'success'),
        error: (err) => {
          apiTrace.putAttribute('status', 'error');
          apiTrace.putAttribute('error_code', String(err.status));
        }
      }),
      finalize(() => apiTrace.stop())
    );
  }

  private getTraceName(url: string): string {
    // Extract meaningful name from URL
    return url.split('/').pop() || 'unknown';
  }
}
```

## Component Render Tracing

Track component initialization time:

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Performance, trace, PerformanceTrace } from '@angular/fire/performance';

@Component({...})
export class Dashboard implements OnInit {
  private performance = inject(Performance);
  private renderTrace: PerformanceTrace;

  constructor() {
    this.renderTrace = trace(this.performance, 'dashboard_render');
    this.renderTrace.start();
  }

  constructor() {
    // Data loading complete
    this.renderTrace.putMetric('widgets_count', 5);
    this.renderTrace.stop();
  }
}
```

## Custom Metrics

Add numerical metrics to traces:

```typescript
const searchTrace = trace(this.performance, 'search_operation');
searchTrace.start();

const results = await this.search(query);

// Add metrics
searchTrace.putMetric('results_count', results.length);
searchTrace.putMetric('query_length', query.length);
searchTrace.putMetric('response_size_kb', JSON.stringify(results).length / 1024);

searchTrace.stop();
```

## Disabling Performance Monitoring

Conditionally disable for testing or user preference:

```typescript
import { providePerformance, getPerformance } from '@angular/fire/performance';

providePerformance(() => {
  const perf = getPerformance();
  
  // Disable in development
  if (!environment.production) {
    perf.dataCollectionEnabled = false;
    perf.instrumentationEnabled = false;
  }
  
  return perf;
}),
```

## Best Practices

1. **Name traces descriptively**: Use names like `load_user_profile`, `search_products`, `checkout_process`
2. **Add relevant attributes**: Include context like user type, data source, or feature flag state
3. **Track critical user flows**: Focus on operations that impact user experience
4. **Use metrics for quantities**: Track counts, sizes, and durations as metrics
5. **Always stop traces**: Use try/finally to ensure traces stop even on errors

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/performance.md
- https://firebase.google.com/docs/perf-mon/get-started-web
- https://firebase.google.com/docs/reference/js/performance
-->
