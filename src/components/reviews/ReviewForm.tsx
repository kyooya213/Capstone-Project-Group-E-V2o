import React, { useState } from 'react';
import { Star, Camera, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/textarea';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface ReviewFormProps {
  orderId: string;
  onReviewSubmitted?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ orderId, onReviewSubmitted }) => {
  const { user } = useAuthStore();
  const [ratings, setRatings] = useState({
    overall: 0,
    quality: 0,
    service: 0,
    delivery: 0
  });
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingCategories = [
    { key: 'overall', label: 'Overall Experience', required: true },
    { key: 'quality', label: 'Print Quality', required: false },
    { key: 'service', label: 'Customer Service', required: false },
    { key: 'delivery', label: 'Delivery/Pickup', required: false }
  ];

  const handleRatingChange = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user || ratings.overall === 0) return;

    setIsSubmitting(true);
    try {
      // Upload photos if any
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileName = `review-${orderId}-${Date.now()}-${photo.name}`;
        const { data, error } = await supabase.storage
          .from('reviews')
          .upload(fileName, photo);
        
        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from('reviews')
            .getPublicUrl(fileName);
          photoUrls.push(publicUrl);
        }
      }

      // Submit review
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            order_id: orderId,
            customer_id: user.id,
            overall_rating: ratings.overall,
            quality_rating: ratings.quality || null,
            service_rating: ratings.service || null,
            delivery_rating: ratings.delivery || null,
            review_text: reviewText.trim() || null,
            photos: photoUrls
          }
        ]);

      if (error) throw error;

      // Reset form
      setRatings({ overall: 0, quality: 0, service: 0, delivery: 0 });
      setReviewText('');
      setPhotos([]);
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (category: string, currentRating: number, required: boolean = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className={`p-1 transition-colors ${
              star <= currentRating
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : required ? 'Required' : 'Optional'}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Categories */}
        <div className="space-y-4">
          {ratingCategories.map(category => (
            <div key={category.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {category.label}
                {category.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderStarRating(category.key, ratings[category.key as keyof typeof ratings], category.required)}
            </div>
          ))}
        </div>

        {/* Written Review */}
        <div>
          <Textarea
            label="Write a Review (Optional)"
            placeholder="Share your experience with other customers..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            fullWidth
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </label>
              <span className="text-sm text-gray-500">
                Up to 5 photos, max 5MB each
              </span>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={ratings.overall === 0 || isSubmitting}
            isLoading={isSubmitting}
            leftIcon={<Send size={18} />}
            fullWidth
          >
            Submit Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};