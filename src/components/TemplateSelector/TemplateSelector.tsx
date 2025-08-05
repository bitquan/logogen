'use client';

import { useState } from 'react';
import { logoTemplates, categories, LogoTemplate } from '@/lib/logoTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: LogoTemplate) => void;
  selectedTemplate: LogoTemplate | null;
}

export default function TemplateSelector({ onSelectTemplate, selectedTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? logoTemplates 
    : logoTemplates.filter(template => template.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Template Preview */}
            <div 
              className="w-full h-20 rounded mb-2 flex items-center justify-center text-sm font-medium"
              style={{ 
                backgroundColor: template.config.backgroundColor,
                color: template.config.textColor,
                fontFamily: template.config.fontFamily
              }}
            >
              <div className="text-center">
                <div className="font-semibold">Sample Logo</div>
                <div className="text-xs opacity-75">Tagline</div>
              </div>
            </div>
            
            {/* Template Info */}
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{template.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{template.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}