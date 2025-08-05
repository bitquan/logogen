'use client';

import { useEffect, useRef, useState } from 'react';
// import { fabric } from 'fabric';
import ColorPicker from '@/components/ColorPicker/ColorPicker';
import FontSelector from '@/components/FontSelector/FontSelector';
import PaymentModal from '@/components/PaymentModal/PaymentModal';
import { LogoTemplate } from '@/lib/logoTemplates';
import { fonts } from '@/lib/utils';
import { Download } from 'lucide-react';

interface LogoEditorProps {
  selectedTemplate: LogoTemplate | null;
  logoData: {
    businessName: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  onLogoDataChange: (data: any) => void;
}

export default function LogoEditor({ selectedTemplate, logoData, onLogoDataChange }: LogoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fabricLoaded, setFabricLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import fabric.js on client side
    import('fabric').then((fabric) => {
      if (canvasRef.current && !canvas) {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: 600,
          height: 400,
          backgroundColor: '#ffffff'
        });
        setCanvas(fabricCanvas);
        setFabricLoaded(true);
      }
    });

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (canvas && selectedTemplate && fabricLoaded) {
      updateCanvas();
    }
  }, [canvas, selectedTemplate, logoData, fabricLoaded]);

  const updateCanvas = async () => {
    if (!canvas || !selectedTemplate) return;

    const fabric = await import('fabric');
    
    canvas.clear();
    canvas.setBackgroundColor(selectedTemplate.config.backgroundColor, canvas.renderAll.bind(canvas));

    const { businessName, tagline, fontFamily } = logoData;
    
    if (businessName) {
      const titleText = new fabric.Text(businessName, {
        left: 300,
        top: 150,
        fontFamily: fontFamily,
        fontSize: selectedTemplate.config.fontSize,
        fill: logoData.primaryColor,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        fontWeight: 'bold'
      });
      canvas.add(titleText);
    }

    if (tagline) {
      const taglineText = new fabric.Text(tagline, {
        left: 300,
        top: 200,
        fontFamily: fontFamily,
        fontSize: Math.round(selectedTemplate.config.fontSize * 0.6),
        fill: logoData.secondaryColor,
        textAlign: 'center',
        originX: 'center',
        originY: 'center'
      });
      canvas.add(taglineText);
    }

    canvas.renderAll();
  };

  const handleDownload = () => {
    if (!logoData.businessName.trim()) {
      alert('Please enter a business name first!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleFreePreview = async () => {
    if (!canvas) return;
    
    const fabric = await import('fabric');
    
    // Add watermark for free download
    const watermark = new fabric.Text('LogoGen', {
      left: 300,
      top: 350,
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 'rgba(0,0,0,0.3)',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
    canvas.add(watermark);
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 0.8
    });
    
    const link = document.createElement('a');
    link.download = `${logoData.businessName}-logo-preview.png`;
    link.href = dataURL;
    link.click();

    // Remove watermark after download
    canvas.remove(watermark);
    canvas.renderAll();
  };

  // Simple canvas preview when Fabric.js is not loaded
  const renderSimplePreview = () => {
    if (!selectedTemplate) return null;

    return (
      <div 
        className="w-full h-[400px] flex flex-col items-center justify-center rounded border"
        style={{ 
          backgroundColor: selectedTemplate.config.backgroundColor,
          fontFamily: logoData.fontFamily 
        }}
      >
        {logoData.businessName && (
          <div 
            className="font-bold text-center"
            style={{ 
              color: logoData.primaryColor,
              fontSize: `${selectedTemplate.config.fontSize}px`
            }}
          >
            {logoData.businessName}
          </div>
        )}
        {logoData.tagline && (
          <div 
            className="text-center mt-2"
            style={{ 
              color: logoData.secondaryColor,
              fontSize: `${Math.round(selectedTemplate.config.fontSize * 0.6)}px`
            }}
          >
            {logoData.tagline}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={logoData.businessName}
            onChange={(e) => onLogoDataChange({ ...logoData, businessName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline (Optional)
          </label>
          <input
            type="text"
            value={logoData.tagline}
            onChange={(e) => onLogoDataChange({ ...logoData, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your tagline"
          />
        </div>
      </div>

      {/* Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <ColorPicker
            color={logoData.primaryColor}
            onChange={(color) => onLogoDataChange({ ...logoData, primaryColor: color })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color
          </label>
          <ColorPicker
            color={logoData.secondaryColor}
            onChange={(color) => onLogoDataChange({ ...logoData, secondaryColor: color })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <FontSelector
            selectedFont={logoData.fontFamily}
            onFontChange={(font) => onLogoDataChange({ ...logoData, fontFamily: font })}
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {fabricLoaded ? (
          <canvas ref={canvasRef} />
        ) : (
          renderSimplePreview()
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleFreePreview}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Download Free Preview (with watermark)
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Purchase High-Quality Download
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          logoData={logoData}
          canvas={canvas}
        />
      )}
    </div>
  );
}