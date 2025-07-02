import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Truck } from 'lucide-react';
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
}

interface PaymentMethodsProps {
  totalAmount: number;
  onPaymentSelect: (method: PaymentMethod, details?: any) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  totalAmount, 
  onPaymentSelect 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'gcash',
      name: 'GCash',
      type: 'digital_wallet',
      icon: <Smartphone className="h-6 w-6 text-blue-600" />,
      description: 'Pay instantly with your GCash wallet',
      processingTime: 'Instant',
      fees: 'Free'
    },
    {
      id: 'paymaya',
      name: 'PayMaya',
      type: 'digital_wallet',
      icon: <Smartphone className="h-6 w-6 text-green-600" />,
      description: 'Secure payment with PayMaya',
      processingTime: 'Instant',
      fees: 'Free'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      icon: <Building className="h-6 w-6 text-gray-600" />,
      description: 'Direct bank transfer (BPI, BDO, Metrobank)',
      processingTime: '1-2 business days',
      fees: 'Bank charges may apply'
    },
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      description: 'Visa, Mastercard, and other major cards',
      processingTime: 'Instant',
      fees: '3.5% processing fee'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      type: 'cod',
      icon: <Truck className="h-6 w-6 text-orange-600" />,
      description: 'Pay when you receive your order',
      processingTime: 'Upon delivery',
      fees: '₱50 handling fee'
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.id);
    setPaymentDetails({});
  };

  const handlePaymentSubmit = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (method) {
      onPaymentSelect(method, paymentDetails);
    }
  };

  const renderPaymentForm = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    switch (method.type) {
      case 'digital_wallet':
        return (
          <div className="space-y-4">
            <Input
              label="Mobile Number"
              placeholder="09XX XXX XXXX"
              value={paymentDetails.mobileNumber || ''}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileNumber: e.target.value })}
              fullWidth
            />
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                You will receive a payment request on your {method.name} app.
              </p>
            </div>
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {method.icon}
                    <div>
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
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
        </CardContent>
      </Card>

      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {renderPaymentForm()}
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-blue-700">
                  ₱{selectedMethod === 'cod' ? (totalAmount + 50).toFixed(2) : totalAmount.toFixed(2)}
                </span>
              </div>
              
              <Button
                onClick={handlePaymentSubmit}
                fullWidth
                size="lg"
              >
                {selectedMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};