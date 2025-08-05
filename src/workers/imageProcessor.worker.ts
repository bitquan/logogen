import { 
  WorkerMessage, 
  WorkerResponse, 
  CanvasObject, 
  ProcessImageData, 
  OptimizeCanvasData 
} from './types';

// Worker for handling heavy image processing tasks
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  switch (type) {
    case 'processImage':
      try {
        const { imageData, width, height, quality } = data as ProcessImageData;
        
        // Create canvas in worker
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('Could not get canvas context');

        // Draw image data
        const bitmap = await createImageBitmap(imageData);
        ctx.drawImage(bitmap, 0, 0);

        // Get processed image data
        const blob = await canvas.convertToBlob({
          type: 'image/png',
          quality: quality || 1
        });

        // Send back processed image
        self.postMessage({
          type: 'processImageComplete',
          data: blob
        });
      } catch (error) {
        self.postMessage({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
      break;

    case 'optimizeCanvas':
      try {
        const { objects } = data as OptimizeCanvasData;
        
        // Perform optimization calculations
        const optimizedObjects = objects.map((obj: CanvasObject) => ({
          ...obj,
          cacheKey: generateCacheKey(obj),
          needsRender: checkNeedsRender(obj)
        }));

        self.postMessage({
          type: 'optimizeCanvasComplete',
          data: optimizedObjects
        });
      } catch (error) {
        self.postMessage({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
      break;
  }
};

// Helper functions
function generateCacheKey(obj: any): string {
  // Generate unique key based on object properties
  return JSON.stringify({
    type: obj.type,
    props: obj.props,
    state: obj.state
  });
}

function checkNeedsRender(obj: any): boolean {
  // Check if object needs to be re-rendered
  return obj.dirty || obj.modified || false;
}
