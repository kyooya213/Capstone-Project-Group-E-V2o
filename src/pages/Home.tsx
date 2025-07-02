import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Truck, 
  CreditCard, 
  ArrowRight,
  Printer,
  Palette,
  Building,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Premium Tarpaulin Printing <span className="text-yellow-300">Made Simple</span>
              </h1>
              <p className="text-lg text-blue-100">
                High-quality tarpaulin printing with fast turnaround times. Perfect for your business, events, and promotional needs.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard/new-order">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Order Now
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/5816296/pexels-photo-5816296.jpeg" 
                alt="Tarpaulin Printing" 
                className="rounded-lg shadow-2xl max-h-[400px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end tarpaulin printing services with a focus on quality and customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <ShieldCheck className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We use top-grade materials and high-resolution printing for vibrant, long-lasting results.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <Clock className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">
                Quick printing and processing with reliable delivery within your timeline.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <Truck className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600">
                Complimentary delivery services for orders within the metro area.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <CreditCard className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Payment</h3>
              <p className="text-gray-600">
                Multiple payment options including online transfers, GCash, and PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              From small signs to large-format outdoor banners, we've got all your printing needs covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <Printer className="h-10 w-10 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tarpaulin Printing</h3>
              <p className="text-gray-600 mb-4">
                High-quality, weather-resistant tarpaulin prints perfect for outdoor advertising, events, and more.
              </p>
              <Link to="/services" className="text-blue-700 font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <Palette className="h-10 w-10 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Design Services</h3>
              <p className="text-gray-600 mb-4">
                Professional design assistance to help you create eye-catching, effective visual content.
              </p>
              <Link to="/services" className="text-blue-700 font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <Building className="h-10 w-10 text-blue-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Installation</h3>
              <p className="text-gray-600 mb-4">
                Professional installation services to ensure your tarpaulins are securely and properly displayed.
              </p>
              <Link to="/services" className="text-blue-700 font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Hear from our satisfied customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-gray-700 mb-4">
                "The quality of the tarpaulins exceeded my expectations. The colors are vibrant and the material is very durable. The team was also very responsive to my inquiries."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Juan Dela Cruz</h4>
                  <p className="text-xs text-gray-500">Event Organizer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-gray-700 mb-4">
                "Fast turnaround and excellent customer service. I needed an urgent banner for a company event, and they delivered it within 24 hours. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  MS
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Maria Santos</h4>
                  <p className="text-xs text-gray-500">Marketing Manager</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-yellow-500" />
                <Award className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-gray-700 mb-4">
                "Great value for money. The online ordering system was very easy to use, and the final product was exactly what I wanted. Will definitely order again."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  RL
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Robert Lee</h4>
                  <p className="text-xs text-gray-500">Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Place Your Order?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Get started with high-quality tarpaulin printing today. Fast, reliable, and affordable.
          </p>
          <Link to="/dashboard/new-order">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Start Your Order
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};