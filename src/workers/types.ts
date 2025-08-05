export interface WorkerMessage {
  type: 'processImage' | 'optimizeCanvas';
  data: ProcessImageData | OptimizeCanvasData;
}

export interface ProcessImageData {
  imageData: ImageData;
  width: number;
  height: number;
  quality?: number;
}

export interface OptimizeCanvasData {
  objects: CanvasObject[];
}

export interface CanvasObject {
  type: string;
  props: Record<string, any>;
  state: Record<string, any>;
  dirty?: boolean;
  modified?: boolean;
}

export interface WorkerResponse {
  type: 'processImageComplete' | 'optimizeCanvasComplete' | 'error';
  data?: Blob | CanvasObject[];
  error?: string;
}

declare global {
  interface Worker {
    postMessage(message: WorkerMessage): void;
    onmessage: ((ev: MessageEvent<WorkerResponse>) => void) | null;
  }
}
