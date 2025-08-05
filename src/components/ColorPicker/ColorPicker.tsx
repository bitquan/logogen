'use client';

import { colorPalettes } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      {/* Current Color Display */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-md border border-gray-300"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
        />
      </div>

      {/* Color Palettes */}
      <div className="space-y-2">
        {colorPalettes.map((palette) => (
          <div key={palette.name} className="space-y-1">
            <h4 className="text-xs font-medium text-gray-600">{palette.name}</h4>
            <div className="flex gap-1">
              {palette.colors.map((paletteColor) => (
                <button
                  key={paletteColor}
                  onClick={() => onChange(paletteColor)}
                  className={`w-6 h-6 rounded border-2 transition-all ${
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
    </div>
  );
}