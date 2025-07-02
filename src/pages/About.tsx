import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const About: React.FC = () => {
  const team = [
    {
      name: 'Juan Dela Cruz',
      position: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      description: '15+ years experience in printing industry'
    },
    {
      name: 'Maria Santos',
      position: 'Head of Design',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      description: 'Creative director with expertise in visual design'
    },
    {
      name: 'Roberto Garcia',
      position: 'Production Manager',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      description: 'Ensures quality and timely delivery of all orders'
    }
  ];

  const values = [
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'Quality First',
      description: 'We never compromise on the quality of our materials and printing processes.'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Timely Delivery',
      description: 'We understand deadlines matter and always deliver on time.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We listen and deliver what you need.'
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: 'Innovation',
      description: 'We continuously upgrade our technology and processes for better results.'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Customers' },
    { number: '15000+', label: 'Orders Completed' },
    { number: '10+', label: 'Years Experience' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About TarpPrint</h1>
              <p className="text-xl text-blue-100 mb-8">
                Your trusted partner for high-quality tarpaulin printing services in the Philippines. 
                We've been serving businesses and individuals with professional printing solutions since 2014.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Get In Touch
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.pexels.com/photos/5816296/pexels-photo-5816296.jpeg"
                alt="About TarpPrint"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Our Story"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  TarpPrint was founded in 2014 with a simple mission: to provide high-quality, 
                  affordable tarpaulin printing services to businesses and individuals across the Philippines.
                </p>
                <p>
                  What started as a small printing shop in Makati has grown into one of the most 
                  trusted names in the industry, serving thousands of customers nationwide.
                </p>
                <p>
                  We've invested in state-of-the-art printing equipment and continuously train our 
                  team to ensure we deliver the best possible results for every project, big or small.
                </p>
                <p>
                  Today, we're proud to be the go-to choice for businesses, event organizers, 
                  political campaigns, and individuals who need professional printing services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and help us deliver exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced team is dedicated to bringing your vision to life with quality and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Our Location</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Come see our facility and discuss your printing needs with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-blue-100">
                123 Print Avenue<br />
                Makati City, Metro Manila<br />
                Philippines 1200
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-blue-100">
                +63 912 345 6789<br />
                +63 917 123 4567
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-blue-100">
                info@tarpprint.com<br />
                orders@tarpprint.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};