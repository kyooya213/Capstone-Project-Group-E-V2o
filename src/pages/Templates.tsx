import React from 'react';
import { TemplateGallery } from '../components/templates/TemplateGallery';

export const Templates: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Design Templates</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Choose from our collection of professionally designed templates or upload your own custom design. 
            All templates are fully customizable to match your specific needs.
          </p>
        </div>
        
        <TemplateGallery />
      </div>
    </div>
  );
};