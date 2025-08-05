// Export utilities for high-resolution logo downloads
import { Canvas, Object as FabricObject } from 'fabric';

export interface ExportOptions {
  format: 'png' | 'jpg';
  quality: number;
  scale: number;
  addWatermark: boolean;
  size: 'small' | 'medium' | 'large' | 'custom';
  customWidth?: number;
  customHeight?: number;
}

type ExportSize = { width: number; height: number };

export const EXPORT_SIZES: Record<string, ExportSize> = {
  small: { width: 512, height: 512 },
  medium: { width: 1024, height: 1024 },
  large: { width: 2048, height: 2048 },
  favicon: { width: 64, height: 64 },
  business_card: { width: 1050, height: 600 },
  letterhead: { width: 2550, height: 3300 }, // 8.5x11 at 300 DPI
};

export class LogoExporter {
  private canvas: Canvas;
  
  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  async exportLogo(options: ExportOptions): Promise<string> {
    try {
      // Create a temporary canvas for export
      const exportCanvas = await this.createExportCanvas(options);
      
      // Add watermark if needed
      if (options.addWatermark) {
        await this.addWatermark(exportCanvas);
      }
      
      // Export to data URL
      const dataURL = exportCanvas.toDataURL({
        format: options.format === 'jpg' ? 'jpeg' : options.format,
        quality: options.quality,
        multiplier: options.scale,
      });
      
      // Clean up temporary canvas
      exportCanvas.dispose();
      
      return dataURL;
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export logo. Please try again.');
    }
  }

  private async createExportCanvas(options: ExportOptions): Promise<Canvas> {
    // Get dimensions
    const { width, height } = this.getExportDimensions(options);
    
    // Create temporary canvas element
    const tempCanvasEl = document.createElement('canvas');
    tempCanvasEl.width = width;
    tempCanvasEl.height = height;
    
    // Create Fabric canvas
    const exportCanvas = new Canvas(tempCanvasEl, {
      width,
      height,
    });
    
    // Set background color
    exportCanvas.backgroundColor = this.canvas.backgroundColor || '#ffffff';
    
    // Clone all objects from original canvas
    const objects = this.canvas.getObjects();
    const canvasWidth = this.canvas.width || width;
    const canvasHeight = this.canvas.height || height;
    
    const clonePromises = objects.map((obj: FabricObject) => {
      return new Promise<void>((resolve) => {
        // @ts-ignore - fabric.js types are incorrect for clone method
        obj.clone((clonedObj: FabricObject) => {
          // Scale object to fit export canvas
          const scaleX = width / canvasWidth;
          const scaleY = height / canvasHeight;
          
          clonedObj.set({
            left: (clonedObj.left || 0) * scaleX,
            top: (clonedObj.top || 0) * scaleY,
            scaleX: (clonedObj.scaleX || 1) * scaleX,
            scaleY: (clonedObj.scaleY || 1) * scaleY,
          });
          
          exportCanvas.add(clonedObj);
          resolve();
        });
      });
    });
    
    // Wait for all objects to be cloned
    await Promise.all(clonePromises);
    
    exportCanvas.renderAll();
    return exportCanvas;
  }

  private getExportDimensions(options: ExportOptions): { width: number; height: number } {
    if (options.size === 'custom' && options.customWidth && options.customHeight) {
      return { width: options.customWidth, height: options.customHeight };
    }
    
    const size = EXPORT_SIZES[options.size] || EXPORT_SIZES.medium;
    return size;
  }

  private async addWatermark(canvas: Canvas): Promise<void> {
    try {
      const { Text } = await import('fabric');
      const canvasWidth = canvas.width || 512;
      const canvasHeight = canvas.height || 512;
      
      const watermark = new Text('LogoGen', {
        left: canvasWidth - 150,
        top: canvasHeight - 50,
        fontSize: Math.max(24, Math.min(canvasWidth, canvasHeight) * 0.02),
        fill: 'rgba(128, 128, 128, 0.5)',
        fontFamily: 'Arial',
        selectable: false,
        evented: false,
      });
      
      canvas.add(watermark);
      canvas.renderAll();
    } catch (error) {
      console.error('Failed to add watermark:', error);
      // Don't throw - watermark is optional and shouldn't block export
    }
  }

  // Export multiple sizes at once
  async exportMultipleSizes(baseOptions: Omit<ExportOptions, 'size'>): Promise<{ [key: string]: string }> {
    const exports: { [key: string]: string } = {};
    const standardSizes: Array<ExportOptions['size']> = ['small', 'medium', 'large'];
    
    for (const size of standardSizes) {
      try {
        const dataURL = await this.exportLogo({ ...baseOptions, size });
        exports[size] = dataURL;
      } catch (error) {
        console.error(`Failed to export ${size}:`, error);
      }
    }
    
    return exports;
  }

  // Download file directly
  downloadLogo(dataURL: string, filename: string): void {
    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download logo. Please try again.');
    }
  }

  // Generate filename based on options
  generateFilename(businessName: string, options: ExportOptions): string {
    const cleanName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const extension = options.format;
    const size = options.size;
    
    return `${cleanName}_logo_${size}_${timestamp}.${extension}`;
  }
}

// Utility function to check if user has premium access
export const hasPremiumAccess = (userPlan: string | null): boolean => {
  return userPlan === 'standard' || userPlan === 'premium';
};

// Export presets for different use cases
export const EXPORT_PRESETS = {
  web: {
    format: 'png' as const,
    quality: 1.0,
    scale: 1,
    size: 'medium' as const,
  },
  print: {
    format: 'png' as const,
    quality: 1.0,
    scale: 3, // 300 DPI equivalent
    size: 'large' as const,
  },
  social: {
    format: 'jpg' as const,
    quality: 0.9,
    scale: 1,
    size: 'medium' as const,
  },
  favicon: {
    format: 'png' as const,
    quality: 1.0,
    scale: 1,
    size: 'custom' as const,
    customWidth: 64,
    customHeight: 64,
  },
};
