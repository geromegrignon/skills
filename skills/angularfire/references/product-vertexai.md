---
name: product-vertexai
description: Firebase Vertex AI for accessing Gemini generative AI models
---

# Vertex AI (Preview)

The Vertex AI Gemini API provides access to Google's latest generative AI models (Gemini) through Firebase.

## Setup

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideVertexAI, getVertexAI } from '@angular/fire/vertexai-preview';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({ ... })),
    provideVertexAI(() => getVertexAI()),
  ],
};
```

## Injecting Vertex AI

```typescript
import { Component, inject } from '@angular/core';
import { VertexAI } from '@angular/fire/vertexai';

@Component({...})
export class AIComponent {
  private vertexAI = inject(VertexAI);
}
```

## Generating Text Content

```typescript
import { VertexAI, getGenerativeModel } from '@angular/fire/vertexai';

@Component({...})
export class ChatComponent {
  private vertexAI = inject(VertexAI);

  async generateText(prompt: string): Promise<string> {
    // Get the Gemini model
    const model = getGenerativeModel(this.vertexAI, { 
      model: 'gemini-1.5-flash' 
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return response.text();
  }
}
```

## Streaming Responses

For real-time text generation:

```typescript
import { VertexAI, getGenerativeModel } from '@angular/fire/vertexai';

@Component({
  template: `
    <textarea [(ngModel)]="prompt"></textarea>
    <button (click)="streamResponse()">Generate</button>
    <div>{{ streamedText }}</div>
  `
})
export class StreamComponent {
  private vertexAI = inject(VertexAI);
  
  prompt = '';
  streamedText = '';

  async streamResponse() {
    const model = getGenerativeModel(this.vertexAI, { 
      model: 'gemini-1.5-flash' 
    });

    this.streamedText = '';
    
    const result = await model.generateContentStream(this.prompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      this.streamedText += chunkText;
    }
  }
}
```

## Multi-turn Conversations

Maintain conversation context:

```typescript
import { VertexAI, getGenerativeModel } from '@angular/fire/vertexai';

@Component({...})
export class ConversationComponent {
  private vertexAI = inject(VertexAI);
  private chat: any;
  
  messages: { role: string; content: string }[] = [];

  initChat() {
    const model = getGenerativeModel(this.vertexAI, { 
      model: 'gemini-1.5-flash' 
    });

    // Start a chat session with history
    this.chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  }

  async sendMessage(userMessage: string) {
    this.messages.push({ role: 'user', content: userMessage });
    
    const result = await this.chat.sendMessage(userMessage);
    const response = result.response.text();
    
    this.messages.push({ role: 'assistant', content: response });
    
    return response;
  }
}
```

## Multimodal Input (Text + Images)

Send images with text prompts:

```typescript
import { VertexAI, getGenerativeModel } from '@angular/fire/vertexai';

@Component({...})
export class ImageAnalysisComponent {
  private vertexAI = inject(VertexAI);

  async analyzeImage(imageFile: File, prompt: string): Promise<string> {
    const model = getGenerativeModel(this.vertexAI, { 
      model: 'gemini-1.5-flash' 
    });

    // Convert image to base64
    const imageData = await this.fileToGenerativePart(imageFile);

    const result = await model.generateContent([
      prompt,
      imageData
    ]);

    return result.response.text();
  }

  private async fileToGenerativePart(file: File) {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: base64.split(',')[1],
        mimeType: file.type
      }
    };
  }
}
```

## Generation Configuration

Customize model behavior:

```typescript
const model = getGenerativeModel(this.vertexAI, { 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,        // Creativity (0-1)
    topP: 0.9,               // Nucleus sampling
    topK: 40,                // Top-k sampling
    maxOutputTokens: 2048,   // Max response length
    stopSequences: ['END'],  // Stop generation at these sequences
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
});
```

## AI Service Pattern

```typescript
import { Injectable, inject } from '@angular/core';
import { VertexAI, getGenerativeModel } from '@angular/fire/vertexai';

@Injectable({ providedIn: 'root' })
export class AIService {
  private vertexAI = inject(VertexAI);

  private getModel(config?: { temperature?: number; maxTokens?: number }) {
    return getGenerativeModel(this.vertexAI, {
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: config?.temperature ?? 0.7,
        maxOutputTokens: config?.maxTokens ?? 1024,
      }
    });
  }

  async summarize(text: string): Promise<string> {
    const model = this.getModel({ temperature: 0.3 });
    const result = await model.generateContent(
      `Summarize the following text:\n\n${text}`
    );
    return result.response.text();
  }

  async generateCode(description: string, language: string): Promise<string> {
    const model = this.getModel({ temperature: 0.2 });
    const result = await model.generateContent(
      `Generate ${language} code for: ${description}`
    );
    return result.response.text();
  }

  async analyzeImage(imageBase64: string, question: string): Promise<string> {
    const model = this.getModel();
    const result = await model.generateContent([
      question,
      { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
    ]);
    return result.response.text();
  }
}
```

## Error Handling

```typescript
async generateWithErrorHandling(prompt: string) {
  try {
    const model = getGenerativeModel(this.vertexAI, { model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    if (error.message?.includes('SAFETY')) {
      console.error('Content blocked by safety filters');
    } else if (error.message?.includes('QUOTA')) {
      console.error('API quota exceeded');
    } else {
      console.error('Generation error:', error);
    }
    throw error;
  }
}
```

<!--
Source references:
- https://github.com/angular/angularfire/blob/main/docs/vertexai.md
- https://firebase.google.com/docs/vertex-ai
- https://firebase.google.com/docs/reference/js/vertexai
-->
