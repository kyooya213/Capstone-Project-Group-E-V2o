import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Truck, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'digital_wallet' | 'bank_transfer' | 'card' | 'cod';
  icon: React.ReactNode;
  description: string;
  processingTime: string;
  fees?: string;
  color: string;
  popular?: boolean;
}

interface TikTokStylePaymentProps {
  totalAmount: number;
  onPaymentSuccess: (method: PaymentMethod, details?: any) => void;
  onClose: () => void;
}

export const TikTokStylePayment: React.FC<TikTokStylePaymentProps> = ({ 
  totalAmount, 
  onPaymentSuccess,
  onClose 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [currentStep, setCurrentStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'gcash',
      name: 'GCash',
      type: 'digital_wallet',
      icon: <Smartphone className="h-6 w-6 text-blue-600" />,
      description: 'Pay instantly with your GCash wallet',
      processingTime: 'Instant',
      fees: 'Free',
      color: 'bg-blue-50 border-blue-200',
      popular: true
    },
    {
      id: 'paymaya',
      name: 'PayMaya',
      type: 'digital_wallet',
      icon: <Smartphone className="h-6 w-6 text-green-600" />,
      description: 'Secure payment with PayMaya',
      processingTime: 'Instant',
      fees: 'Free',
      color: 'bg-green-50 border-green-200',
      popular: true
    },
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      description: 'Visa, Mastercard, and other major cards',
      processingTime: 'Instant',
      fees: '3.5% processing fee',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      icon: <Building className="h-6 w-6 text-gray-600" />,
      description: 'Direct bank transfer (BPI, BDO, Metrobank)',
      processingTime: '1-2 business days',
      fees: 'Bank charges may apply',
      color: 'bg-gray-50 border-gray-200'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      type: 'cod',
      icon: <Truck className="h-6 w-6 text-orange-600" />,
      description: 'Pay when you receive your order',
      processingTime: 'Upon delivery',
      fees: '₱50 handling fee',
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.id);
    setCurrentStep('details');
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setCurrentStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentStep('success');
    
    // Auto-close after success
    setTimeout(() => {
      const method = paymentMethods.find(m => m.id === selectedMethod);
      if (method) {
        onPaymentSuccess(method, paymentDetails);
      }
    }, 2000);
  };

  const renderPaymentForm = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    switch (method.type) {
      case 'digital_wallet':
        return (
          <div className="space-y-4">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pay with {method.name}
              </h3>
              <p className="text-gray-600 mb-4">
                You will be redirected to {method.name} to complete your payment
              </p>
              <div className="text-2xl font-bold text-blue-600">
                ₱{totalAmount.toFixed(2)}
              </div>
            </div>
            <Input
              label="Mobile Number"
              placeholder="09XX XXX XXXX"
              value={paymentDetails.mobileNumber || ''}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileNumber: e.target.value })}
              fullWidth
            />
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber || ''}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
              fullWidth
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate || ''}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                fullWidth
              />
              <Input
                label="CVV"
                placeholder="123"
                value={paymentDetails.cvv || ''}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                fullWidth
              />
            </div>
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={paymentDetails.cardholderName || ''}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
              fullWidth
            />
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Bank Account Details:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Account Name:</strong> TarpPrint Business</p>
                <p><strong>BPI:</strong> 1234-5678-90</p>
                <p><strong>BDO:</strong> 9876-5432-10</p>
                <p><strong>Metrobank:</strong> 5555-4444-33</p>
              </div>
            </div>
            <Input
              label="Reference Number"
              placeholder="Enter bank reference number"
              value={paymentDetails.referenceNumber || ''}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, referenceNumber: e.target.value })}
              fullWidth
            />
          </div>
        );

      case 'cod':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                You will pay ₱{(totalAmount + 50).toFixed(2)} (including ₱50 handling fee) when your order is delivered.
              </p>
            </div>
            <Input
              label="Delivery Address"
              placeholder="Complete delivery address"
              value={paymentDetails.deliveryAddress || ''}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, deliveryAddress: e.target.value })}
              fullWidth
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your payment transaction was successful, thank you for supporting us!
              </p>
              <div className="text-2xl font-bold text-green-600">
                ₱{totalAmount.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {currentStep === 'details' && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<ArrowLeft size={16} />}
                  onClick={() => setCurrentStep('select')}
                  className="mr-2"
                >
                  Back
                </Button>
              )}
              <CardTitle>
                {currentStep === 'select' ? 'Choose Payment Method' : 'Payment Details'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">₱{totalAmount.toFixed(2)}</p>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 'select' ? (
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${method.color}`}
                  onClick={() => handleMethodSelect(method)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{method.name}</h4>
                          {method.popular && (
                            <Badge variant="primary" className="text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {method.processingTime}
                      </Badge>
                      {method.fees && (
                        <p className="text-xs text-gray-500">{method.fees}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {renderPaymentForm()}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-700">
                    ₱{selectedMethod === 'cod' ? (totalAmount + 50).toFixed(2) : totalAmount.toFixed(2)}
                  </span>
                </div>
                
                <Button
                  onClick={handlePaymentSubmit}
                  isLoading={isProcessing}
                  fullWidth
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {selectedMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};