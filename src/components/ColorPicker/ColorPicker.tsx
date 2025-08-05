'use client';

import { useState } from 'react';
import { colorPalettes } from '@/lib/utils';
import { Palette, Pipette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customColor, setCustomColor] = useState(color);

  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor);
    onChange(newColor);
  };

  const recentColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#808080', '#800080'
  ];

  return (
    <div className="space-y-3">
      {/* Current Color Display */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <input
            type="text"
            value={color}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#000000"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            className="w-full h-8 mt-1 rounded border border-gray-300 cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center gap-1"
        >
          <Palette size={14} />
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {/* Recent Colors */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-600">Recent Colors</h4>
        <div className="flex gap-1 flex-wrap">
          {recentColors.map((recentColor, index) => (
            <button
              key={index}
              onClick={() => onChange(recentColor)}
              className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                color === recentColor ? 'border-blue-500 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: recentColor }}
              title={recentColor}
            />
          ))}
        </div>
      </div>

      {/* Color Palettes */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-600">Color Palettes</h4>
        {colorPalettes.map((palette) => (
          <div key={palette.name} className="space-y-1">
            <h5 className="text-xs text-gray-500">{palette.name}</h5>
            <div className="flex gap-1 flex-wrap">
              {palette.colors.map((paletteColor) => (
                <button
                  key={paletteColor}
                  onClick={() => onChange(paletteColor)}
                  className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 ${
                    color === paletteColor ? 'border-blue-500 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: paletteColor }}
                  title={paletteColor}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Color Controls */}
      {showAdvanced && (
        <div className="space-y-3 border-t pt-3">
          <h4 className="text-xs font-medium text-gray-600">Advanced Controls</h4>
          
          {/* RGB Sliders */}
          <div className="space-y-2">
            {['R', 'G', 'B'].map((channel, index) => {
              const rgb = hexToRgb(color);
              const value = rgb ? rgb[channel.toLowerCase() as keyof typeof rgb] : 0;
              
              return (
                <div key={channel} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-4">{channel}</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={value}
                    onChange={(e) => {
                      if (rgb) {
                        const newRgb = { ...rgb };
                        newRgb[channel.toLowerCase() as keyof typeof rgb] = parseInt(e.target.value);
                        onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">{value}</span>
                </div>
              );
            })}
          </div>

          {/* Opacity Slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-4">A</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="100"
              className="flex-1"
            />
            <span className="text-xs w-8 text-right">100</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}