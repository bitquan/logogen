'use client';

import { fonts } from '@/lib/utils';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export default function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  return (
    <div className="space-y-2">
      <select
        value={selectedFont}
        onChange={(e) => onFontChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {fonts.map((font) => (
          <option key={font.name} value={font.name}>
            {font.name} ({font.category})
          </option>
        ))}
      </select>

      {/* Font Preview */}
      <div
        className="p-3 border border-gray-200 rounded-md text-center bg-gray-50"
        style={{ fontFamily: selectedFont }}
      >
        <div className="text-lg font-bold">Sample Text</div>
        <div className="text-sm text-gray-600">The quick brown fox</div>
      </div>
    </div>
  );
}