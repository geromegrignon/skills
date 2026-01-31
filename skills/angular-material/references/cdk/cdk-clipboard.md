---
name: cdk-clipboard
description: CDK utilities for copying text to the system clipboard
---

# CDK Clipboard

## Imports

```ts
import { ClipboardModule, CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Clipboard, PendingCopy } from '@angular/cdk/clipboard';
```

Utilities for copying text to the system clipboard.

## Click to Copy Directive

```html
<button [cdkCopyToClipboard]="textToCopy">Copy</button>

<img src="avatar.jpg" 
     [cdkCopyToClipboard]="user.bio" 
     alt="Click to copy bio">
```

## Copy Event

```html
<button [cdkCopyToClipboard]="text" 
        (cdkCopyToClipboardCopied)="onCopied($event)">
  Copy
</button>
```

```ts
onCopied(success: boolean): void {
  if (success) {
    this.showToast('Copied!');
  } else {
    this.showToast('Copy failed');
  }
}
```

## Retry Attempts

For long text that may fail on first attempt:

```html
<button [cdkCopyToClipboard]="longText" 
        [cdkCopyToClipboardAttempts]="5">
  Copy Long Text
</button>
```

## Programmatic Copy

### Simple Copy

```ts
import {Clipboard} from '@angular/cdk/clipboard';

@Component({...})
export class App {
  clipboard = inject(Clipboard);

  copyText(): void {
    const success = this.clipboard.copy('Text to copy');
    if (success) {
      console.log('Copied successfully');
    }
  }
}
```

### Long Text (Buffered Copy)

For large content, use `beginCopy` to prepare:

```ts
copyLargeText(): void {
  const pending = this.clipboard.beginCopy(this.largeText);
  
  let remainingAttempts = 3;
  
  const attempt = (): void => {
    const result = pending.copy();
    if (!result && --remainingAttempts) {
      // Retry after brief delay
      setTimeout(attempt, 100);
    } else {
      // Always destroy when done
      pending.destroy();
      
      if (result) {
        this.showSuccess();
      } else {
        this.showError();
      }
    }
  };
  
  attempt();
}
```

**Important:** Always call `pending.destroy()` when finished.

## Use Cases

### Copy Share Link

```html
<button mat-icon-button 
        [cdkCopyToClipboard]="shareUrl"
        (cdkCopyToClipboardCopied)="showCopyFeedback($event)"
        aria-label="Copy share link">
  <mat-icon>link</mat-icon>
</button>
```

### Copy Code Block

```html
<div class="code-block">
  <pre>{{codeSnippet}}</pre>
  <button mat-icon-button 
          [cdkCopyToClipboard]="codeSnippet"
          class="copy-button">
    <mat-icon>content_copy</mat-icon>
  </button>
</div>
```

### Copy from Input

```html
<mat-form-field>
  <input matInput #input value="Copy this text" readonly>
  <button mat-icon-button matSuffix [cdkCopyToClipboard]="input.value">
    <mat-icon>content_copy</mat-icon>
  </button>
</mat-form-field>
```

## Key Points

- `cdkCopyToClipboard` directive for declarative copying
- `Clipboard` service for programmatic copying
- `copy()` returns boolean indicating success
- Use `beginCopy()` for large text with retry logic
- Always `destroy()` PendingCopy objects to clean up
- `cdkCopyToClipboardAttempts` handles retries automatically
- `cdkCopyToClipboardCopied` event reports success/failure

<!--
Source references:
- https://github.com/angular/components/blob/main/src/cdk/clipboard/clipboard.md
- https://material.angular.dev/cdk/clipboard/overview
-->
