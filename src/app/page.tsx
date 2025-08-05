'use client';

import { useState } from 'react';
import LogoEditor from '@/components/LogoEditor/LogoEditor';
import TemplateSelector from '@/components/TemplateSelector/TemplateSelector';
import { LogoTemplate } from '@/lib/logoTemplates';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<LogoTemplate | null>(null);
  const [logoData, setLogoData] = useState({
    businessName: '',
    tagline: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter'
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create Your Perfect Logo
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Design professional logos in minutes with our AI-powered logo generator. 
          Choose from templates, customize, and download high-quality files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
            <TemplateSelector 
              onSelectTemplate={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </div>

        {/* Logo Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Customize Your Logo</h2>
            <LogoEditor 
              selectedTemplate={selectedTemplate}
              logoData={logoData}
              onLogoDataChange={setLogoData}
            />
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Simple 3-Step Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create</h3>
            <p className="text-gray-600">Enter your business name and choose a template</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customize</h3>
            <p className="text-gray-600">Adjust colors, fonts, and layout to your liking</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download</h3>
            <p className="text-gray-600">Purchase and download high-resolution files</p>
          </div>
        </div>
      </div>
    </main>
  );
}
