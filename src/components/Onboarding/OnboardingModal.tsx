import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Palette, Type, Image, Download } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  
  const steps = [
    {
      title: 'Welcome to LogoGen!',
      description: 'Create professional logos in minutes with our easy-to-use editor.',
      icon: Palette,
    },
    {
      title: 'Choose Your Style',
      description: 'Start with a template or create from scratch. Add text, shapes, and professional icons.',
      icon: Type,
    },
    {
      title: 'Customize Everything',
      description: 'Change colors, fonts, and layout. Add effects like shadows and gradients.',
      icon: Image,
    },
    {
      title: 'Export & Download',
      description: 'Get your logo in multiple formats and sizes, perfect for any use.',
      icon: Download,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {steps[step - 1].icon && (
              <div className="text-blue-600">
                {React.createElement(steps[step - 1].icon, { size: 32 })}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {steps[step - 1].title}
          </h2>
          <p className="text-gray-600">
            {steps[step - 1].description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                step === index + 1 ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`flex items-center gap-1 px-4 py-2 rounded ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          
          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Get Started
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
