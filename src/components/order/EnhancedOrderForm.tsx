import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Calculator, Palette, CreditCard, CheckCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui/Select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TemplateGallery } from '../templates/TemplateGallery';
import { TikTokStylePayment } from '../payment/TikTokStylePayment';
import { usePhpAuthStore } from '../../store/phpAuthStore';
import { phpApi } from '../../lib/phpApi';
import { materials } from '../../lib/data';
import { calculatePrice } from '../../lib/utils';

const schema = z.object({
  width: z.coerce.number().min(0.5, 'Width must be at least 0.5m').max(10, 'Width cannot exceed 10m'),
  height: z.coerce.number().min(0.5, 'Height must be at least 0.5m').max(10, 'Height cannot exceed 10m'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
  materialId: z.string().min(1, 'Please select a material'),
  designNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const EnhancedOrderForm: React.FC = () => {
  const { user } = usePhpAuthStore();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const materialOptions: SelectOption[] = materials.map(material => ({
    value: material.id,
    label: `${material.name} - ₱${material.pricePerSqm}/sqm`,
    disabled: !material.available
  }));
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      width: 1,
      height: 1,
      quantity: 1,
      materialId: '',
    }
  });
  
  const watchedFields = watch(['width', 'height', 'quantity', 'materialId']);
  
  useEffect(() => {
    const [width, height, quantity, materialId] = watchedFields;
    
    if (width && height && quantity && materialId) {
      const material = materials.find(m => m.id === materialId);
      if (material) {
        let basePrice = calculatePrice(width, height, quantity, material.pricePerSqm);
        if (selectedTemplate?.price_modifier) {
          basePrice += selectedTemplate.price_modifier * quantity;
        }
        setEstimatedPrice(basePrice);
      }
    }
  }, [watchedFields, selectedTemplate]);

  const steps = [
    { id: 1, title: 'Design', description: 'Choose template or upload design' },
    { id: 2, title: 'Specifications', description: 'Size, material, and quantity' },
    { id: 3, title: 'Review', description: 'Confirm your order' }
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setSelectedFile(null);
    setUploadedFileUrl(null);
    setUploadedFileName(null);
    setCurrentStep(2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedTemplate(null);
      
      // Upload file immediately
      setIsUploading(true);
      try {
        const response = await phpApi.uploadFile(file);
        if (response.success) {
          setUploadedFileUrl(response.file_url);
          setUploadedFileName(response.file_name);
          setCurrentStep(2);
        } else {
          alert('Failed to upload file. Please try again.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSpecsSubmit = (data: FormData) => {
    setCurrentStep(3);
  };

  const handlePaymentSuccess = async (method: any, details: any) => {
    if (!user) {
      navigate('/php-login');
      return;
    }

    const formData = watch();
    
    try {
      const orderData = {
        width: formData.width,
        height: formData.height,
        quantity: formData.quantity,
        material_id: formData.materialId,
        design_notes: formData.designNotes || null,
        file_url: uploadedFileUrl || selectedTemplate?.file_url || null,
        file_name: uploadedFileName || selectedTemplate?.name || null,
        total_price: estimatedPrice || 0,
        is_paid: method.id !== 'cod',
        payment_method: method.name,
        payment_reference: details?.referenceNumber || null
      };

      const response = await phpApi.createOrder(orderData);
      
      if (response.success) {
        setShowPayment(false);
        setOrderSuccess(true);
        
        // Redirect after success message
        setTimeout(() => {
          navigate('/dashboard/orders');
        }, 3000);
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Choose Your Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Custom Design</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Have your own design? Upload it here.
                    </p>
                    <input
                      type="file"
                      id="custom-upload"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="custom-upload"
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </label>
                  </div>
                  
                  <div className="text-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                    <Palette className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Use Template</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Browse our professional templates below.
                    </p>
                  </div>
                </div>
                
                {selectedFile && uploadedFileUrl && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✓ Custom file uploaded: {selectedFile.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <TemplateGallery onSelectTemplate={handleTemplateSelect} showSelectButton />
          </div>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Order Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleSpecsSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Width (meters)"
                    type="number"
                    step="0.1"
                    {...register('width')}
                    error={errors.width?.message}
                    fullWidth
                  />
                  
                  <Input
                    label="Height (meters)"
                    type="number"
                    step="0.1"
                    {...register('height')}
                    error={errors.height?.message}
                    fullWidth
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Quantity"
                    type="number"
                    {...register('quantity')}
                    error={errors.quantity?.message}
                    fullWidth
                  />
                  
                  <Select
                    label="Material"
                    options={materialOptions}
                    {...register('materialId')}
                    error={errors.materialId?.message}
                    fullWidth
                  />
                </div>
                
                <Textarea
                  label="Design Notes (Optional)"
                  placeholder="Any special instructions or requirements..."
                  {...register('designNotes')}
                  fullWidth
                />
                
                {estimatedPrice !== null && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center">
                      <Calculator className="h-6 w-6 text-blue-700 mr-2" />
                      <span className="text-blue-800 font-medium">Estimated Price:</span>
                      <span className="ml-2 text-blue-800 font-bold text-lg">₱{estimatedPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <Button type="submit" fullWidth>
                  Continue to Review
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Order Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Design</h3>
                  {selectedTemplate ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedTemplate.preview_url}
                        alt={selectedTemplate.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{selectedTemplate.name}</p>
                        <p className="text-sm text-gray-500">{selectedTemplate.category}</p>
                      </div>
                    </div>
                  ) : selectedFile ? (
                    <p className="text-gray-700">Custom file: {selectedFile.name}</p>
                  ) : null}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Specifications</h3>
                  <div className="space-y-1 text-sm">
                    <p>Size: {watch('width')}m × {watch('height')}m</p>
                    <p>Quantity: {watch('quantity')}</p>
                    <p>Material: {materials.find(m => m.id === watch('materialId'))?.name}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                <p className="text-xl font-bold text-blue-700 mt-2">
                  Total: ₱{estimatedPrice?.toFixed(2)}
                </p>
              </div>
              
              <Button
                onClick={() => setShowPayment(true)}
                leftIcon={<CreditCard size={18} />}
                fullWidth
                size="lg"
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your payment transaction was successful, thank you for supporting us!
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to your orders...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-700' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      {currentStep > 1 && currentStep < 3 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Previous Step
          </Button>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && estimatedPrice && (
        <TikTokStylePayment
          totalAmount={estimatedPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};