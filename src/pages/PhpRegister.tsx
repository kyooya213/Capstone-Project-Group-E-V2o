import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Server } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { usePhpAuthStore } from '../store/phpAuthStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export const PhpRegister: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register: registerUser } = usePhpAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: FormData) => {
    setRegisterError(null);
    
    try {
      const success = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      
      if (success) {
        navigate('/dashboard');
      } else {
        setRegisterError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      setRegisterError(error.message || 'An error occurred during registration. Please try again later.');
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Server className="h-8 w-8 text-green-700" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            PHP/XAMPP Authentication System
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/php-login" className="font-medium text-blue-700 hover:text-blue-800">
              sign in to your account
            </Link>
          </p>
        </div>
        
        <div className="bg-white p-8 shadow rounded-lg">
          {registerError && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {registerError}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              fullWidth
            />
            
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              fullWidth
            />
            
            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              fullWidth
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={errors.password?.message}
                fullWidth
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                fullWidth
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="font-medium text-blue-700 hover:text-blue-800">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-blue-700 hover:text-blue-800">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<UserPlus size={18} />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-xs text-gray-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-green-700 mb-1">🔧 Setup Required:</p>
              <p>Make sure XAMPP is running and database is imported</p>
              <p>Backend: <code>http://localhost/php-backend</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};