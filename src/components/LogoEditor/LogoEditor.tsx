'use client';

import { useEffect, useRef, useState } from 'react';
// import { fabric } from 'fabric';
import ColorPicker from '@/components/ColorPicker/ColorPicker';
import FontSelector from '@/components/FontSelector/FontSelector';
import PaymentModal from '@/components/PaymentModal/PaymentModal';
import { LogoTemplate } from '@/lib/logoTemplates';
import { fonts } from '@/lib/utils';
import { LogoExporter, hasPremiumAccess, EXPORT_PRESETS, ExportOptions } from '@/lib/exportUtils';
import { 
  Download, 
  Plus, 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  Heart,
  Zap,
  Crown,
  Shield,
  Camera,
  Palette,
  Settings,
  Type,
  Image as ImageIcon,
  Layers,
  RotateCcw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { iconLibrary, getAllIcons, getIconsByCategory, searchIcons } from '@/lib/iconLibrary';

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

interface CanvasObject {
  id: string;
  type: 'text' | 'shape' | 'icon';
  name: string;
  visible: boolean;
  locked: boolean;
  fabricObject?: any;
}

const shapes = [
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
];

const icons = [
  { id: 'crown', name: 'Crown', icon: Crown },
  { id: 'shield', name: 'Shield', icon: Shield },
  { id: 'zap', name: 'Lightning', icon: Zap },
  { id: 'camera', name: 'Camera', icon: Camera },
  { id: 'palette', name: 'Palette', icon: Palette },
];

export default function LogoEditor({ selectedTemplate, logoData, onLogoDataChange }: LogoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'shapes' | 'icons' | 'layers' | 'export'>('text');
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([]);
  const [objectCounter, setObjectCounter] = useState(0);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [selectedIconCategory, setSelectedIconCategory] = useState('all');

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null); // 'standard', 'premium', or null for free
  const [exportSettings, setExportSettings] = useState<ExportOptions>({
    format: 'png',
    quality: 1.0,
    scale: 1,
    addWatermark: true,
    size: 'medium',
  });

  // Text customization state
  const [textSettings, setTextSettings] = useState({
    fontSize: 32,
    fontWeight: 'normal',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 1.2,
    textDecoration: 'none',
    fontStyle: 'normal',
  });

  // Shape/Icon customization state
  const [shapeSettings, setShapeSettings] = useState({
    fill: '#3b82f6',
    stroke: '#000000',
    strokeWidth: 0,
    opacity: 1,
    shadow: false,
    shadowColor: '#000000',
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
  });

  useEffect(() => {
    // Dynamically import fabric.js on client side
    const initCanvas = async () => {
      try {
        console.log('Starting canvas initialization...');
        
        // Import fabric with different syntax for v6+
        const fabric = await import('fabric');
        console.log('Fabric module loaded:', fabric);
        console.log('Fabric keys:', Object.keys(fabric));
        
        // For Fabric.js v6, use the default export directly
        const { Canvas, Text, Rect, Circle, Triangle, Polygon, Path } = fabric;
        console.log('Fabric components extracted:', { Canvas, Text, Rect, Circle, Triangle, Polygon, Path });
        
        if (!Canvas) {
          console.error('Canvas not found in fabric import');
          return;
        }
        
        console.log('Canvas ref current:', canvasRef.current);
        console.log('Existing canvas state:', canvas);
        console.log('Conditions check - canvasRef.current:', !!canvasRef.current, 'no existing canvas:', !canvas);
        
        if (canvasRef.current && !canvas) {
          console.log('Creating new canvas...');
          console.log('Canvas element:', canvasRef.current);
          console.log('Canvas constructor:', Canvas);
          
          try {
            // Initialize canvas with fixed dimensions
            const fabricCanvas = new Canvas(canvasRef.current);
            
            // Set canvas size
            fabricCanvas.setDimensions({
              width: 800,
              height: 600
            }, {
              cssOnly: false
            });
            
            // Set initial properties
            fabricCanvas.set({
              backgroundColor: '#ffffff',
              preserveObjectStacking: true,
            });
            
            console.log('Canvas created successfully:', fabricCanvas);
            
            // Add selection events
            fabricCanvas.on('selection:created', (e) => {
              console.log('Object selected:', e.selected[0]);
              setSelectedObject(e.selected[0]);
            });
            
            fabricCanvas.on('selection:updated', (e) => {
              setSelectedObject(e.selected[0]);
            });
            
            fabricCanvas.on('selection:cleared', () => {
              setSelectedObject(null);
            });

            // Test canvas by adding a simple welcome text
            const welcomeText = new Text('Canvas Ready! Click shapes to add them.', {
              left: 400,
              top: 300,
              fontFamily: 'Arial',
              fontSize: 16,
              fill: '#666666',
              textAlign: 'center',
              originX: 'center',
              originY: 'center',
              selectable: false,
              evented: false,
            });
            
            console.log('Welcome text created:', welcomeText);
            
            fabricCanvas.add(welcomeText);
            fabricCanvas.renderAll();
            
            console.log('Canvas setup complete, setting state...');
            setCanvas(fabricCanvas);
            setFabricLoaded(true);
            
            console.log('Canvas initialized successfully!', fabricCanvas);
            
            // Remove welcome text after 3 seconds
            setTimeout(() => {
              if (fabricCanvas.contains(welcomeText)) {
                fabricCanvas.remove(welcomeText);
                fabricCanvas.renderAll();
              }
            }, 3000);
          } catch (canvasError) {
            console.error('Error creating canvas:', canvasError);
          }
        }
      } catch (error) {
        console.error('Failed to load Fabric.js:', error);
        // Fallback: show error state
        setFabricLoaded(false);
      }
    };

    console.log('useEffect running, fabricLoaded:', fabricLoaded);
    
    // Wait for canvas element to be mounted with multiple attempts
    let retryCount = 0;
    const maxRetries = 20; // Prevent infinite loops
    
    const initializeCanvas = () => {
      console.log(`Attempting to initialize canvas (attempt ${retryCount + 1}), canvasRef.current:`, canvasRef.current);
      
      if (canvasRef.current && !fabricLoaded) {
        console.log('Canvas element found, initializing...');
        initCanvas();
      } else if (!canvasRef.current && retryCount < maxRetries) {
        retryCount++;
        console.log(`Canvas element not ready, retrying... (${retryCount}/${maxRetries})`);
        setTimeout(initializeCanvas, 200);
      } else if (retryCount >= maxRetries) {
        console.error('Failed to find canvas element after maximum retries');
        setFabricLoaded(false);
      }
    };
    
    // Start initialization
    initializeCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []); // Remove dependencies to prevent infinite loops

  useEffect(() => {
    async function applyTemplate() {
      if (!canvas || !fabricLoaded || !selectedTemplate) return;

      try {
        const { Text, Path } = await import('fabric');
        
        // Clear existing canvas
        canvas.clear();
        
        // Update canvas background and render initial state
        canvas.backgroundColor = selectedTemplate.config.backgroundColor;
        canvas.renderAll();

        // Create and add business name text
        const titleText = new Text(logoData.businessName || 'Sample Logo', {
          left: 400,
          top: 250,
          fontFamily: selectedTemplate.config.fontFamily,
          fontSize: selectedTemplate.config.fontSize,
          fill: selectedTemplate.config.textColor,
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          fontWeight: 'bold'
        });
        
        canvas.add(titleText);
        
        // Add tagline if it exists
        if (logoData.tagline) {
          const taglineText = new Text(logoData.tagline, {
            left: 400,
            top: 250 + selectedTemplate.config.fontSize + 20,
            fontFamily: selectedTemplate.config.fontFamily,
            fontSize: Math.round(selectedTemplate.config.fontSize * 0.6),
            fill: selectedTemplate.config.textColor,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            opacity: 0.8
          });
          canvas.add(taglineText);
        }

        // Add template icon if specified
        if (selectedTemplate.config.iconType) {
          const icons = getIconsByCategory(selectedTemplate.config.iconType);
          if (icons.length > 0) {
            const iconObj = new Path(icons[0].svgPath, {
              left: 400,
              top: selectedTemplate.config.layout === 'stacked' ? 150 : 280,
              fill: selectedTemplate.config.textColor,
              scaleX: 2,
              scaleY: 2,
              originX: 'center',
              originY: 'center'
            });
            canvas.add(iconObj);
          }
        }

        canvas.renderAll();

        // Add to canvas objects
        const newObjects: CanvasObject[] = [];
        newObjects.push({
          id: 'template-title',
          type: 'text',
          name: 'Business Name',
          visible: true,
          locked: false,
          fabricObject: titleText
        });

        if (logoData.tagline) {
          newObjects.push({
            id: 'template-tagline',
            type: 'text',
            name: 'Tagline',
            visible: true,
            locked: false,
            fabricObject: titleText
          });
        }

        setCanvasObjects(newObjects);
      } catch (error) {
        console.error('Error applying template:', error);
      }
    }

    if (canvas && fabricLoaded && selectedTemplate) {
      applyTemplate();
    }
  }, [canvas, selectedTemplate, logoData, fabricLoaded]);

  const updateCanvas = async () => {
    if (!canvas || !selectedTemplate) return;

    try {
      const { Text } = await import('fabric');
      
      console.log('Updating canvas with template:', selectedTemplate);
      
      // Clear existing canvas objects
      setCanvasObjects([]);
      canvas.clear();
      
      // Set background color based on template or default white
      const backgroundColor = selectedTemplate.config.backgroundColor || '#ffffff';
      canvas.backgroundColor = backgroundColor;
      canvas.renderAll();

      // Add initial business name and tagline if they exist
      const { businessName, tagline, fontFamily } = logoData;
      
      if (businessName && selectedTemplate) {
        const titleText = new Text(businessName, {
          left: 400,
          top: 250,
          fontFamily: fontFamily,
          fontSize: selectedTemplate.config.fontSize,
          fill: logoData.primaryColor,
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          fontWeight: 'bold'
        });
        canvas.add(titleText);
        
        const titleObject: CanvasObject = {
          id: 'initial-title',
          type: 'text',
          name: 'Business Name',
          visible: true,
          locked: false,
          fabricObject: titleText,
        };
        setCanvasObjects(prev => [...prev, titleObject]);
        console.log('Added business name to canvas');
      }

      if (tagline && canvasObjects.length <= 1 && selectedTemplate) {
        const taglineText = new Text(tagline, {
          left: 400,
          top: 320,
          fontFamily: fontFamily,
          fontSize: Math.round(selectedTemplate.config.fontSize * 0.6),
          fill: logoData.secondaryColor,
          textAlign: 'center',
          originX: 'center',
          originY: 'center'
        });
        canvas.add(taglineText);
        
        const taglineObject: CanvasObject = {
          id: 'initial-tagline',
          type: 'text',
          name: 'Tagline',
          visible: true,
          locked: false,
          fabricObject: taglineText,
        };
        setCanvasObjects(prev => [...prev, taglineObject]);
        console.log('Added tagline to canvas');
      }

      canvas.renderAll();
    } catch (error) {
      console.error('Error updating canvas:', error);
    }
  };

  const addText = async () => {
    if (!canvas) return;
    
    try {
      const { Text } = await import('fabric');
      
      const counter = objectCounter + 1;
      setObjectCounter(counter);
      
      console.log('Adding text to canvas');
      
      const text = new Text(`Text ${counter}`, {
        left: 150,
        top: 150,
        fontFamily: logoData.fontFamily,
        fontSize: textSettings.fontSize,
        fill: logoData.primaryColor,
        fontWeight: textSettings.fontWeight,
        textAlign: textSettings.textAlign,
        charSpacing: textSettings.letterSpacing * 1000,
        lineHeight: textSettings.lineHeight,
        fontStyle: textSettings.fontStyle,
      });
      
      if (textSettings.textDecoration === 'underline') {
        text.set('underline', true);
      }
      
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      
      const newObject: CanvasObject = {
        id: `text-${counter}`,
        type: 'text',
        name: `Text ${counter}`,
        visible: true,
        locked: false,
        fabricObject: text,
      };
      
      setCanvasObjects(prev => [...prev, newObject]);
      setSelectedObject(text);
      
      console.log('Text added successfully', text);
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

  const addShape = async (shapeType: string) => {
    if (!canvas) return;
    
    try {
      const { Rect, Circle, Triangle, Polygon, Path } = await import('fabric');
      
      const counter = objectCounter + 1;
      setObjectCounter(counter);
      
      console.log('Adding shape to canvas:', shapeType);
      
      let shape: any;
      
      switch (shapeType) {
        case 'rectangle':
          shape = new Rect({
            left: 150,
            top: 150,
            width: 100,
            height: 60,
            fill: shapeSettings.fill,
            stroke: shapeSettings.strokeWidth > 0 ? shapeSettings.stroke : '',
            strokeWidth: shapeSettings.strokeWidth,
          });
          break;
        case 'circle':
          shape = new Circle({
            left: 150,
            top: 150,
            radius: 50,
            fill: shapeSettings.fill,
            stroke: shapeSettings.strokeWidth > 0 ? shapeSettings.stroke : '',
            strokeWidth: shapeSettings.strokeWidth,
          });
          break;
        case 'triangle':
          shape = new Triangle({
            left: 150,
            top: 150,
            width: 100,
            height: 100,
            fill: shapeSettings.fill,
            stroke: shapeSettings.strokeWidth > 0 ? shapeSettings.stroke : '',
            strokeWidth: shapeSettings.strokeWidth,
          });
          break;
        case 'star':
          // Create a simple star using polygon
          const starPoints = [
            {x: 50, y: 0},
            {x: 61, y: 35},
            {x: 98, y: 35},
            {x: 68, y: 57},
            {x: 79, y: 91},
            {x: 50, y: 70},
            {x: 21, y: 91},
            {x: 32, y: 57},
            {x: 2, y: 35},
            {x: 39, y: 35}
          ];
          shape = new Polygon(starPoints, {
            left: 150,
            top: 150,
            fill: shapeSettings.fill,
            stroke: shapeSettings.strokeWidth > 0 ? shapeSettings.stroke : '',
            strokeWidth: shapeSettings.strokeWidth,
          });
          break;
        case 'heart':
          // Create a simple heart using path
          const heartPath = 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z';
          shape = new Path(heartPath, {
            left: 150,
            top: 150,
            fill: shapeSettings.fill,
            stroke: shapeSettings.strokeWidth > 0 ? shapeSettings.stroke : '',
            strokeWidth: shapeSettings.strokeWidth,
            scaleX: 3,
            scaleY: 3,
          });
          break;
        default:
          console.log('Unknown shape type:', shapeType);
          return;
      }
      
      if (shapeSettings.shadow) {
        shape.set('shadow', {
          color: shapeSettings.shadowColor,
          blur: shapeSettings.shadowBlur,
          offsetX: shapeSettings.shadowOffsetX,
          offsetY: shapeSettings.shadowOffsetY,
        });
      }
      
      shape.set('opacity', shapeSettings.opacity);
      
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      
      const newObject: CanvasObject = {
        id: `shape-${counter}`,
        type: 'shape',
        name: `${shapeType} ${counter}`,
        visible: true,
        locked: false,
        fabricObject: shape,
      };
      
      setCanvasObjects(prev => [...prev, newObject]);
      setSelectedObject(shape);
      
      console.log('Shape added successfully', shape);
    } catch (error) {
      console.error('Error adding shape:', error);
    }
  };

  const duplicateObject = () => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.clone((cloned: any) => {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      
      const counter = objectCounter + 1;
      setObjectCounter(counter);
      
      const newObject: CanvasObject = {
        id: `copy-${counter}`,
        type: selectedObject.type === 'text' ? 'text' : 'shape',
        name: `Copy ${counter}`,
        visible: true,
        locked: false,
        fabricObject: cloned,
      };
      
      setCanvasObjects(prev => [...prev, newObject]);
      setSelectedObject(cloned);
    });
  };

  const deleteObject = () => {
    if (!selectedObject || !canvas) return;
    
    canvas.remove(selectedObject);
    setCanvasObjects(prev => prev.filter(obj => obj.fabricObject !== selectedObject));
    setSelectedObject(null);
  };

  const toggleObjectVisibility = (objectId: string) => {
    setCanvasObjects(prev => prev.map(obj => {
      if (obj.id === objectId) {
        const newVisible = !obj.visible;
        obj.fabricObject.set('visible', newVisible);
        canvas.renderAll();
        return { ...obj, visible: newVisible };
      }
      return obj;
    }));
  };

  const toggleObjectLock = (objectId: string) => {
    setCanvasObjects(prev => prev.map(obj => {
      if (obj.id === objectId) {
        const newLocked = !obj.locked;
        obj.fabricObject.set({
          lockMovementX: newLocked,
          lockMovementY: newLocked,
          lockRotation: newLocked,
          lockScalingX: newLocked,
          lockScalingY: newLocked,
          selectable: !newLocked,
        });
        canvas.renderAll();
        return { ...obj, locked: newLocked };
      }
      return obj;
    }));
  };

  const updateSelectedObjectStyle = (property: string, value: any) => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.set(property, value);
    canvas.renderAll();
  };

  const updateTextSettings = (property: string, value: any) => {
    setTextSettings(prev => ({ ...prev, [property]: value }));
    
    if (selectedObject && selectedObject.type === 'text') {
      if (property === 'letterSpacing') {
        selectedObject.set('charSpacing', value * 1000);
      } else if (property === 'textDecoration') {
        selectedObject.set('underline', value === 'underline');
      } else {
        selectedObject.set(property, value);
      }
      canvas.renderAll();
    }
  };

  const addIcon = async (iconData: any) => {
    if (!canvas) return;
    
    try {
      const { Path } = await import('fabric');
      
      const counter = objectCounter + 1;
      setObjectCounter(counter);
      
      console.log('Adding icon to canvas:', iconData.name);
      
      const icon = new Path(iconData.svgPath, {
        left: 200,
        top: 200,
        fill: logoData.primaryColor,
        stroke: shapeSettings.strokeWidth > 0 ? shapeSettings.stroke : '',
        strokeWidth: shapeSettings.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        opacity: shapeSettings.opacity,
      });
      
      if (shapeSettings.shadow) {
        icon.set('shadow', {
          color: shapeSettings.shadowColor,
          blur: shapeSettings.shadowBlur,
          offsetX: shapeSettings.shadowOffsetX,
          offsetY: shapeSettings.shadowOffsetY,
        });
      }
      
      canvas.add(icon);
      canvas.setActiveObject(icon);
      canvas.renderAll();
      
      const newObject: CanvasObject = {
        id: `icon-${counter}`,
        type: 'icon',
        name: `${iconData.name} ${counter}`,
        visible: true,
        locked: false,
        fabricObject: icon,
      };
      
      setCanvasObjects(prev => [...prev, newObject]);
      setSelectedObject(icon);
      
      console.log('Icon added successfully', icon);
    } catch (error) {
      console.error('Error adding icon:', error);
    }
  };

  const updateShapeSettings = (property: string, value: any) => {
    setShapeSettings(prev => ({ ...prev, [property]: value }));
    
    if (selectedObject && (selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle' || selectedObject.type === 'polygon' || selectedObject.type === 'path')) {
      if (property === 'shadow') {
        if (value) {
          selectedObject.set('shadow', {
            color: shapeSettings.shadowColor,
            blur: shapeSettings.shadowBlur,
            offsetX: shapeSettings.shadowOffsetX,
            offsetY: shapeSettings.shadowOffsetY,
          });
        } else {
          selectedObject.set('shadow', null);
        }
      } else if (property.startsWith('shadow') && shapeSettings.shadow) {
        const shadowObj = selectedObject.shadow || {};
        const shadowProp = property.replace('shadow', '').toLowerCase();
        if (shadowProp === 'offsetx') shadowObj.offsetX = value;
        else if (shadowProp === 'offsety') shadowObj.offsetY = value;
        else shadowObj[shadowProp] = value;
        selectedObject.set('shadow', shadowObj);
      } else {
        selectedObject.set(property, value);
      }
      canvas.renderAll();
    }
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
    
    const { Text } = await import('fabric');
    
    // Add watermark for free download
    const watermark = new Text('LogoGen', {
      left: 400,
      top: 550,
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
    link.download = `${logoData.businessName || 'logo'}-preview.png`;
    link.href = dataURL;
    link.click();

    // Remove watermark after download
    canvas.remove(watermark);
    canvas.renderAll();
  };

  // New professional export functions
  const handleExport = async (preset?: keyof typeof EXPORT_PRESETS) => {
    if (!canvas) return;
    
    setIsExporting(true);
    
    try {
      const exporter = new LogoExporter(canvas);
      const isPremium = hasPremiumAccess(userPlan);
      
      // Use preset or current settings
      const options = preset ? 
        { ...EXPORT_PRESETS[preset], addWatermark: !isPremium } :
        { ...exportSettings, addWatermark: !isPremium };
      
      const dataURL = await exporter.exportLogo(options);
      const filename = exporter.generateFilename(logoData.businessName || 'logo', options);
      
      exporter.downloadLogo(dataURL, filename);
      
      // Show premium upgrade if watermarked
      if (!isPremium) {
        setShowPaymentModal(true);
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleMultipleExport = async () => {
    if (!canvas || !hasPremiumAccess(userPlan)) {
      setShowPaymentModal(true);
      return;
    }
    
    setIsExporting(true);
    
    try {
      const exporter = new LogoExporter(canvas);
      const exports = await exporter.exportMultipleSizes({
        format: exportSettings.format,
        quality: exportSettings.quality,
        scale: exportSettings.scale,
        addWatermark: false, // Premium users get clean exports
      });
      
      // Download all sizes
      Object.entries(exports).forEach(([size, dataURL]) => {
        const filename = `${logoData.businessName || 'logo'}_${size}.${exportSettings.format}`;
        setTimeout(() => {
          exporter.downloadLogo(dataURL, filename);
        }, 100); // Small delay between downloads
      });
      
    } catch (error) {
      console.error('Multiple export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Simple canvas preview when Fabric.js is not loaded
  const renderSimplePreview = () => {
    return (
      <div 
        className="w-full h-[600px] flex flex-col items-center justify-center rounded border bg-gray-50"
        style={{ 
          backgroundColor: selectedTemplate?.config.backgroundColor || '#ffffff',
          fontFamily: logoData.fontFamily 
        }}
      >
        <div className="text-gray-500 mb-4">
          {selectedTemplate ? 'Loading Advanced Editor...' : 'Select a template to get started'}
        </div>
        {logoData.businessName && selectedTemplate && (
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
        {logoData.tagline && selectedTemplate && (
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

  const renderTextControls = () => (
    <div className="space-y-4">
      <button
        onClick={() => {
          console.log('Add text button clicked, canvas:', canvas, 'fabricLoaded:', fabricLoaded);
          addText();
        }}
        disabled={!fabricLoaded}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        {fabricLoaded ? 'Add Text' : 'Loading...'}
      </button>
      
      {selectedObject && selectedObject.type === 'text' && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-900">Text Properties</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <input
              type="range"
              min="12"
              max="120"
              value={selectedObject.fontSize || 32}
              onChange={(e) => updateSelectedObjectStyle('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{selectedObject.fontSize || 32}px</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
            <select
              value={selectedObject.fontWeight || 'normal'}
              onChange={(e) => updateSelectedObjectStyle('fontWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Light</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
            <select
              value={selectedObject.textAlign || 'center'}
              onChange={(e) => updateSelectedObjectStyle('textAlign', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing</label>
            <input
              type="range"
              min="-0.1"
              max="0.5"
              step="0.01"
              value={(selectedObject.charSpacing || 0) / 1000}
              onChange={(e) => updateSelectedObjectStyle('charSpacing', parseFloat(e.target.value) * 1000)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <ColorPicker
              color={selectedObject.fill || '#000000'}
              onChange={(color) => updateSelectedObjectStyle('fill', color)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderShapeControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => {
              console.log('Shape button clicked:', shape.id, 'canvas:', canvas, 'fabricLoaded:', fabricLoaded);
              addShape(shape.id);
            }}
            disabled={!fabricLoaded}
            className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 flex flex-col items-center gap-1 text-xs"
          >
            <shape.icon size={20} />
            {shape.name}
          </button>
        ))}
      </div>
      
      {selectedObject && (selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle' || selectedObject.type === 'polygon' || selectedObject.type === 'path') && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-900">Shape Properties</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
            <ColorPicker
              color={selectedObject.fill || '#3b82f6'}
              onChange={(color) => updateSelectedObjectStyle('fill', color)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Width</label>
            <input
              type="range"
              min="0"
              max="20"
              value={selectedObject.strokeWidth || 0}
              onChange={(e) => updateSelectedObjectStyle('strokeWidth', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{selectedObject.strokeWidth || 0}px</span>
          </div>
          
          {(selectedObject.strokeWidth || 0) > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
              <ColorPicker
                color={selectedObject.stroke || '#000000'}
                onChange={(color) => updateSelectedObjectStyle('stroke', color)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedObject.opacity || 1}
              onChange={(e) => updateSelectedObjectStyle('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{Math.round((selectedObject.opacity || 1) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderIconControls = () => {
    const filteredIcons = iconSearchQuery 
      ? searchIcons(iconSearchQuery)
      : selectedIconCategory === 'all' 
        ? getAllIcons()
        : getIconsByCategory(selectedIconCategory);

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search icons..."
            value={iconSearchQuery}
            onChange={(e) => setIconSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {['all', 'business', 'tech', 'creative', 'food', 'health', 'retail', 'beauty'].map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedIconCategory(category);
                setIconSearchQuery('');
              }}
              className={`px-2 py-1 text-xs rounded ${
                selectedIconCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {filteredIcons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => addIcon(icon)}
              disabled={!fabricLoaded}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 flex flex-col items-center gap-1 text-xs"
              title={icon.name}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-gray-600"
              >
                <path d={icon.svgPath} />
              </svg>
              <span className="truncate w-full text-center">{icon.name}</span>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {iconSearchQuery ? 'No icons found' : 'No icons in this category'}
          </div>
        )}
      </div>
    );
  };

  const renderLayersPanel = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Layers</h4>
        <div className="flex gap-1">
          <button
            onClick={duplicateObject}
            disabled={!selectedObject}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={deleteObject}
            disabled={!selectedObject}
            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {canvasObjects.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No objects yet. Add some text or shapes!
        </div>
      ) : (
        <div className="space-y-1">
          {canvasObjects.map((obj) => (
            <div
              key={obj.id}
              className={`flex items-center justify-between p-2 rounded border ${
                selectedObject === obj.fabricObject ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => {
                canvas.setActiveObject(obj.fabricObject);
                setSelectedObject(obj.fabricObject);
              }}
            >
              <span className="text-sm font-medium truncate">{obj.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleObjectVisibility(obj.id);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title={obj.visible ? 'Hide' : 'Show'}
                >
                  {obj.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleObjectLock(obj.id);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title={obj.locked ? 'Unlock' : 'Lock'}
                >
                  {obj.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExportPanel = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900">Export Logo</h4>
        {!hasPremiumAccess(userPlan) && (
          <span className="text-xs text-orange-600 font-medium">Free Version</span>
        )}
      </div>
      
      {/* Quick Export Buttons */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Quick Export</h5>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleExport('web')}
            disabled={isExporting}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="text-sm font-medium">Web</div>
            <div className="text-xs text-gray-500">1024x1024 PNG</div>
          </button>
          <button
            onClick={() => handleExport('print')}
            disabled={isExporting}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="text-sm font-medium">Print</div>
            <div className="text-xs text-gray-500">2048x2048 PNG</div>
          </button>
          <button
            onClick={() => handleExport('social')}
            disabled={isExporting}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="text-sm font-medium">Social</div>
            <div className="text-xs text-gray-500">1024x1024 JPG</div>
          </button>
          <button
            onClick={() => handleExport('favicon')}
            disabled={isExporting}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="text-sm font-medium">Favicon</div>
            <div className="text-xs text-gray-500">64x64 PNG</div>
          </button>
        </div>
      </div>

      {/* Custom Export Settings */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">Custom Settings</h5>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Format</label>
          <select
            value={exportSettings.format}
            onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value as 'png' | 'jpg' }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="png">PNG (Transparent)</option>
            <option value="jpg">JPG (Smaller file)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
          <select
            value={exportSettings.size}
            onChange={(e) => setExportSettings(prev => ({ ...prev, size: e.target.value as any }))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="small">Small (512x512)</option>
            <option value="medium">Medium (1024x1024)</option>
            <option value="large">Large (2048x2048)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Quality</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={exportSettings.quality}
            onChange={(e) => setExportSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">{Math.round(exportSettings.quality * 100)}%</div>
        </div>

        <button
          onClick={() => handleExport()}
          disabled={isExporting}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download size={16} />
              Export Logo
            </>
          )}
        </button>
      </div>

      {/* Premium Features */}
      {hasPremiumAccess(userPlan) ? (
        <div className="space-y-2">
          <button
            onClick={handleMultipleExport}
            disabled={isExporting}
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Crown size={16} />
            Export All Sizes
          </button>
        </div>
      ) : (
        <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="text-sm font-medium text-purple-900 mb-1">Premium Features</div>
          <div className="text-xs text-purple-700 mb-2">
            • No watermark<br/>
            • Multiple formats<br/>
            • Bulk export<br/>
            • Commercial license
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="text-xs bg-purple-600 text-white px-3 py-1 rounded font-medium hover:bg-purple-700"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Watermark Notice */}
      {!hasPremiumAccess(userPlan) && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          Free downloads include a small watermark. Upgrade to remove it!
        </div>
      )}
    </div>
  );

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

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Canvas */}
        <div className="xl:col-span-3">
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative">
            <div className="relative w-full" style={{ height: '600px', background: '#ffffff' }}>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </div>
            <div className="absolute top-2 right-2 text-white px-2 py-1 rounded text-xs">
              {fabricLoaded ? (
                <span className="bg-green-500 px-2 py-1 rounded">Canvas Ready</span>
              ) : (
                <span className="bg-yellow-500 px-2 py-1 rounded">Loading Canvas...</span>
              )}
            </div>
            {!fabricLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center">
                {renderSimplePreview()}
              </div>
            )}
          </div>
          
          {/* Canvas Controls */}
          {fabricLoaded && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={duplicateObject}
                disabled={!selectedObject}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
              >
                <Copy size={16} />
                Duplicate
              </button>
              <button
                onClick={deleteObject}
                disabled={!selectedObject}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={() => canvas?.clear()}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'text', label: 'Text', icon: Type },
                { id: 'shapes', label: 'Shapes', icon: Square },
                { id: 'icons', label: 'Icons', icon: Star },
                { id: 'layers', label: 'Layers', icon: Layers },
                { id: 'export', label: 'Export', icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-2 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <tab.icon size={14} />
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'text' && renderTextControls()}
              {activeTab === 'shapes' && renderShapeControls()}
              {activeTab === 'icons' && renderIconControls()}
              {activeTab === 'layers' && renderLayersPanel()}
              {activeTab === 'export' && renderExportPanel()}
            </div>
          </div>

          {/* Color Palette */}
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Color Palette</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <ColorPicker
                  color={logoData.primaryColor}
                  onChange={(color) => onLogoDataChange({ ...logoData, primaryColor: color })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <ColorPicker
                  color={logoData.secondaryColor}
                  onChange={(color) => onLogoDataChange({ ...logoData, secondaryColor: color })}
                />
              </div>
            </div>
          </div>

          {/* Font Selector */}
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <FontSelector
              selectedFont={logoData.fontFamily}
              onFontChange={(font) => onLogoDataChange({ ...logoData, fontFamily: font })}
            />
          </div>
        </div>
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