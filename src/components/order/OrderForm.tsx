import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Calculator } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui/Select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
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

export const OrderForm: React.FC = () => {
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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
  
  // Calculate price when form values change
  useEffect(() => {
    const [width, height, quantity, materialId] = watchedFields;
    
    if (width && height && quantity && materialId) {
      setIsCalculating(true);
      
      // Get material price per sqm
      const material = materials.find(m => m.id === materialId);
      
      if (material) {
        const total = calculatePrice(width, height, quantity, material.pricePerSqm);
        setEstimatedPrice(total);
      }
      
      setIsCalculating(false);
    }
  }, [watchedFields]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // In a real app, this would upload the file to a server/cloud storage
    // and get back a URL to store in the order
    const fileUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;
    
    const newOrder = createOrder({
      customerId: user.id,
      width: data.width,
      height: data.height,
      quantity: data.quantity,
      materialId: data.materialId,
      designNotes: data.designNotes,
      fileUrl,
      fileName: selectedFile?.name,
      statusId: '1', // Default to 'pending'
      isPaid: false,
    });
    
    navigate(`/dashboard/orders/${newOrder.id}`);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Place New Order</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="Provide any special instructions or requirements..."
            {...register('designNotes')}
            fullWidth
          />
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-700">Upload Design File</h3>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, or PDF up to 10MB</p>
              
              <div className="mt-4">
                <input
                  type="file"
                  id="file-upload"
                  className="sr-only"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Choose file
                </label>
              </div>
              
              {selectedFile && (
                <div className="mt-4 flex items-center justify-center text-sm text-gray-800">
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="ml-2 text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>
          
          {estimatedPrice !== null && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center">
                <Calculator className="h-6 w-6 text-blue-700 mr-2" />
                <span className="text-blue-800 font-medium">Estimated Price:</span>
                <span className="ml-2 text-blue-800 font-bold text-lg">₱{estimatedPrice.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-blue-700">
                This is an estimate based on the dimensions, quantity, and material selected.
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting || !selectedFile}
            >
              Place Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};