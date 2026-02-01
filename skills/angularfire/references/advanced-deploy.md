---
name: advanced-deploy
description: Deploying Angular applications to Firebase Hosting with CLI schematics
---

# Firebase Hosting Deployment

AngularFire provides schematics to deploy Angular applications to Firebase Hosting with a single command.

## Setup

Add AngularFire to your project:

```bash
ng add @angular/fire
```

The schematic will:
1. Open Firebase authentication flow (if not signed in)
2. Prompt to select a Firebase project
3. Create `firebase.json` and `.firebaserc` configuration files
4. Add the `deploy` builder to your `angular.json`

## Deploying

Deploy your application:

```bash
ng deploy
```

This will:
1. Build your application for production
2. Deploy static assets to Firebase Hosting
3. (If SSR) Deploy server as a Cloud Function

### Deploy Specific Project

```bash
ng deploy --project=my-project-name
```

## Configuration

### Basic Configuration

Your `angular.json` will include:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "deploy": {
          "builder": "@angular/fire:deploy",
          "options": {}
        }
      }
    }
  }
}
```

### SSR Deployment

For Angular Universal/SSR applications:

```json
{
  "deploy": {
    "builder": "@angular/fire:deploy",
    "options": {
      "ssr": true
    }
  }
}
```

### Cloud Functions Configuration

Configure the Cloud Function runtime:

```json
{
  "deploy": {
    "builder": "@angular/fire:deploy",
    "options": {
      "ssr": true,
      "functionsNodeVersion": 18,
      "functionsRuntimeOptions": {
        "memory": "1GB",
        "timeoutSeconds": 60,
        "vpcConnector": "my-vpc-connector",
        "vpcConnectorEgressSettings": "PRIVATE_RANGES_ONLY"
      }
    }
  }
}
```

## Multiple Environments

Configure different Firebase projects for different environments:

```json
{
  "deploy": {
    "builder": "@angular/fire:deploy",
    "options": {
      "buildTarget": "my-app:build",
      "firebaseProject": "my-dev-project"
    },
    "configurations": {
      "production": {
        "buildTarget": "my-app:build:production",
        "firebaseProject": "my-prod-project"
      },
      "staging": {
        "buildTarget": "my-app:build:staging",
        "firebaseProject": "my-staging-project"
      }
    }
  }
}
```

Deploy to specific environment:

```bash
# Development (default)
ng deploy

# Staging
ng deploy --configuration=staging
```

## Multiple Sites

Deploy to different Firebase Hosting sites:

```json
{
  "deploy": {
    "builder": "@angular/fire:deploy",
    "options": {
      "buildTarget": "my-app:build",
      "firebaseProject": "my-project",
      "siteTarget": "my-default-site"
    },
    "configurations": {
      "production": {
        "buildTarget": "my-app:build:production",
        "siteTarget": "my-production-site"
      },
      "storybook": {
        "buildTarget": "my-app:build-storybook",
        "siteTarget": "my-storybook-site"
      }
    }
  }
}
```

Firebase Hosting multi-site configuration in `firebase.json`:

```json
{
  "hosting": [
    {
      "target": "my-default-site",
      "public": "dist/my-app",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ]
    },
    {
      "target": "my-production-site",
      "public": "dist/my-app",
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ]
    }
  ]
}
```

## Preview Before Deploy

Test your SSR application locally before deploying:

```bash
ng deploy --preview
```

This creates the function and `package.json` in your output directory, then run:

```bash
firebase serve
```

## Manual firebase.json Configuration

Customize hosting behavior in `firebase.json`:

```json
{
  "hosting": {
    "public": "dist/my-app/browser",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
        "headers": [
          { "key": "Access-Control-Allow-Origin", "value": "*" }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "max-age=31536000" }
        ]
      }
    ],
    "redirects": [
      {
        "source": "/old-page",
        "destination": "/new-page",
        "type": 301
      }
    ]
  }
}
```

## CI/CD Integration

Deploy from CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Deploy to Firebase
  run: |
    npm ci
    npm run build -- --configuration=production
    npx firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
```

Generate a CI token:

```bash
firebase login:ci
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/deploy/getting-started.md
- https://firebase.google.com/docs/hosting/full-config
-->
