---
name: product-storage
description: Firebase Cloud Storage for file uploads, downloads, and management
---

# Cloud Storage

Firebase Cloud Storage allows developers to upload and share user-generated content like images, videos, and other files.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideStorage(() => getStorage()),
  ],
};
```

## Injecting Storage

```typescript
import { Component, inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';

@Component({...})
export class StorageComponent {
  private storage = inject(Storage);
}
```

## File Upload

### Basic Upload

```typescript
import { Storage, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  template: `
    <input type="file" #fileInput (change)="onFileSelected($event)" />
    <button (click)="uploadFile(fileInput)">Upload</button>
  `
})
export class UploadComponent {
  private storage = inject(Storage);

  async uploadFile(input: HTMLInputElement) {
    if (!input.files) return;

    const file = input.files[0];
    const storageRef = ref(this.storage, `uploads/${file.name}`);
    
    // Simple upload
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded:', snapshot.metadata.fullPath);
  }
}
```

### Upload with Progress

```typescript
import { 
  Storage, ref, uploadBytesResumable, 
  percentage, getDownloadURL 
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  template: `
    <input type="file" (change)="onFileSelected($event)" />
    @if (uploadProgress$ | async; as progress) {
      <progress [value]="progress" max="100">{{ progress }}%</progress>
    }
  `
})
export class ProgressUploadComponent {
  private storage = inject(Storage);
  uploadProgress$: Observable<number> | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const storageRef = ref(this.storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Track upload progress
    this.uploadProgress$ = percentage(uploadTask);

    // Handle completion
    uploadTask.then(async (snapshot) => {
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
    });
  }
}
```

### Upload Multiple Files

```typescript
@Component({...})
export class MultiUploadComponent {
  private storage = inject(Storage);

  async uploadFiles(input: HTMLInputElement) {
    if (!input.files) return;

    const files = Array.from(input.files);
    const uploadPromises = files.map(file => {
      const storageRef = ref(this.storage, `uploads/${file.name}`);
      return uploadBytes(storageRef, file);
    });

    const snapshots = await Promise.all(uploadPromises);
    console.log(`Uploaded ${snapshots.length} files`);
  }
}
```

## File Download

### Get Download URL

```typescript
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';

@Component({...})
export class DownloadComponent {
  private storage = inject(Storage);

  async getFileUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }
}
```

### Download as Blob

```typescript
import { Storage, ref, getBlob } from '@angular/fire/storage';

async downloadFile(path: string) {
  const storageRef = ref(this.storage, path);
  const blob = await getBlob(storageRef);
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = path.split('/').pop() || 'download';
  a.click();
  URL.revokeObjectURL(url);
}
```

## File Metadata

```typescript
import { 
  Storage, ref, 
  getMetadata, updateMetadata 
} from '@angular/fire/storage';

@Component({...})
export class MetadataComponent {
  private storage = inject(Storage);

  async getFileMetadata(path: string) {
    const storageRef = ref(this.storage, path);
    const metadata = await getMetadata(storageRef);
    console.log('Content type:', metadata.contentType);
    console.log('Size:', metadata.size);
    console.log('Created:', metadata.timeCreated);
  }

  async updateFileMetadata(path: string) {
    const storageRef = ref(this.storage, path);
    await updateMetadata(storageRef, {
      contentType: 'image/jpeg',
      customMetadata: {
        'uploadedBy': 'user123'
      }
    });
  }
}
```

## Delete Files

```typescript
import { Storage, ref, deleteObject } from '@angular/fire/storage';

async deleteFile(path: string) {
  const storageRef = ref(this.storage, path);
  await deleteObject(storageRef);
}
```

## List Files

```typescript
import { Storage, ref, list, listAll } from '@angular/fire/storage';

@Component({...})
export class ListComponent {
  private storage = inject(Storage);

  // List with pagination
  async listFiles(path: string) {
    const storageRef = ref(this.storage, path);
    const result = await list(storageRef, { maxResults: 10 });
    
    // Files in current directory
    result.items.forEach(item => console.log('File:', item.fullPath));
    
    // Subdirectories
    result.prefixes.forEach(prefix => console.log('Folder:', prefix.fullPath));
    
    // Get next page
    if (result.nextPageToken) {
      const nextPage = await list(storageRef, { 
        maxResults: 10, 
        pageToken: result.nextPageToken 
      });
    }
  }

  // List all files (use carefully with large directories)
  async listAllFiles(path: string) {
    const storageRef = ref(this.storage, path);
    const result = await listAll(storageRef);
    return result.items;
  }
}
```

## Upload with Custom Metadata

```typescript
import { Storage, ref, uploadBytes } from '@angular/fire/storage';

async uploadWithMetadata(file: File, userId: string) {
  const storageRef = ref(this.storage, `uploads/${file.name}`);
  
  const metadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      originalName: file.name,
      uploadedAt: new Date().toISOString()
    }
  };

  return uploadBytes(storageRef, file, metadata);
}
```

## Storage Reference Paths

```typescript
import { Storage, ref } from '@angular/fire/storage';

// Root reference
const rootRef = ref(this.storage);

// File reference from path
const fileRef = ref(this.storage, 'images/photo.jpg');

// Child reference
const childRef = ref(fileRef, 'thumbnails/thumb.jpg');

// Parent reference
const parentRef = fileRef.parent;

// Get path parts
console.log(fileRef.name);      // 'photo.jpg'
console.log(fileRef.fullPath);  // 'images/photo.jpg'
console.log(fileRef.bucket);    // 'your-bucket.appspot.com'
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/storage.md
- https://firebase.google.com/docs/storage/web/start
- https://firebase.google.com/docs/reference/js/storage
-->
