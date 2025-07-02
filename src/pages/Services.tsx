import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, Palette, Truck, Clock, Shield, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Tarpaulin Printing',
      description: 'High-quality, weather-resistant tarpaulin prints perfect for outdoor advertising and events.',
      image: 'https://images.pexels.com/photos/5816296/pexels-photo-5816296.jpeg',
      features: ['Waterproof material', 'UV-resistant inks', 'Custom sizes available', 'Fast turnaround'],
      price: 'Starting at ₱180/sqm'
    },
    {
      id: 2,
      title: 'Banner Printing',
      description: 'Professional vinyl banners for indoor and outdoor use with vibrant colors.',
      image: 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg',
      features: ['Heavy-duty vinyl', 'Grommets included', 'Wind-resistant', 'Full-color printing'],
      price: 'Starting at ₱250/sqm'
    },
    {
      id: 3,
      title: 'Event Signage',
      description: 'Complete signage solutions for weddings, birthdays, corporate events, and celebrations.',
      image: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg',
      features: ['Custom designs', 'Multiple sizes', 'Quick setup', 'Professional finish'],
      price: 'Starting at ₱200/sqm'
    },
    {
      id: 4,
      title: 'Business Signage',
      description: 'Professional business signs and storefront displays to attract customers.',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      features: ['Durable materials', 'Weather-resistant', 'Custom branding', 'Installation service'],
      price: 'Starting at ₱300/sqm'
    },
    {
      id: 5,
      title: 'Promotional Materials',
      description: 'Eye-catching promotional banners and displays for sales, offers, and marketing campaigns.',
      image: 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg',
      features: ['Attention-grabbing designs', 'Quick production', 'Cost-effective', 'Reusable materials'],
      price: 'Starting at ₱180/sqm'
    },
    {
      id: 6,
      title: 'Political Campaign Materials',
      description: 'Campaign banners, posters, and signage for political candidates and parties.',
      image: 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg',
      features: ['Compliant materials', 'Bulk discounts', 'Fast delivery', 'Weather-proof'],
      price: 'Starting at ₱160/sqm'
    }
  ];

  const features = [
    {
      icon: <Printer className="h-8 w-8 text-blue-600" />,
      title: 'High-Quality Printing',
      description: 'State-of-the-art printing equipment for crisp, vibrant results'
    },
    {
      icon: <Palette className="h-8 w-8 text-blue-600" />,
      title: 'Custom Designs',
      description: 'Professional design services or use your own artwork'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Fast Turnaround',
      description: 'Quick production times without compromising quality'
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: 'Free Delivery',
      description: 'Complimentary delivery within Metro Manila'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Weather Resistant',
      description: 'Durable materials that withstand outdoor conditions'
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee on all our products'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Professional tarpaulin printing services for all your business and personal needs. 
              High-quality materials, vibrant colors, and fast delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From business signage to event banners, we provide comprehensive printing solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {service.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/dashboard/new-order">
                    <Button className="w-full">Order Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TarpPrint</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine quality materials, advanced printing technology, and excellent service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today for a free quote or browse our templates to place your order online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/templates">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Browse Templates
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};