import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Server } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { usePhpAuthStore } from '../store/phpAuthStore';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export const PhpLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login } = usePhpAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: FormData) => {
    setLoginError(null);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      setLoginError(error.message || 'An error occurred. Please try again later.');
      console.error(error);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Server className="h-8 w-8 text-blue-700" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            PHP/XAMPP Authentication System
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/php-register" className="font-medium text-blue-700 hover:text-blue-800">
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="bg-white p-8 shadow rounded-lg">
          {loginError && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {loginError}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
              fullWidth
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-700 hover:text-blue-800">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<LogIn size={18} />}
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded">
                <p className="font-medium mb-1">Customer:</p>
                <p>Email: customer@example.com</p>
                <p>Password: password123</p>
              </div>
              <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded">
                <p className="font-medium mb-1">Admin:</p>
                <p>Email: admin@tarpprint.com</p>
                <p>Password: password123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
              <p className="font-medium text-blue-700 mb-1">🔧 Setup Required:</p>
              <p>Make sure XAMPP is running and database is imported</p>
              <p>Backend: <code>http://localhost/php-backend</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};