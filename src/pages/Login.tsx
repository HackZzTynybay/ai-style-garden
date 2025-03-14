
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Logo from '@/components/Logo';
import { authApi } from '@/utils/api';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  
  // Get email from location state if available
  const emailFromState = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailFromState,
      password: '',
      rememberMe: false,
    },
  });
  
  // Set email from location state when component mounts
  useEffect(() => {
    if (emailFromState) {
      setValue('email', emailFromState);
    }
  }, [emailFromState, setValue]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FormData) => {
    setLoggingIn(true);
    try {
      // Call login API
      const response = await authApi.login({
        email: data.email,
        password: data.password
      });
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in',
      });
      
      // Store user data from response
      const userData = {
        id: response.user?.id,
        firstName: response.user?.firstName,
        lastName: response.user?.lastName,
        email: response.user?.email
      };
      
      // Navigate to welcome page
      navigate('/welcome', { state: userData });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Welcome Back</h1>
          <p className="text-hr-gray-subtext mb-6">
            Sign in to your account
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-hr-gray-text mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@company.com"
                {...register('email')}
                className={`w-full ${errors.email ? 'border-hr-error' : 'border-hr-gray-border'}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-hr-error">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-hr-gray-text mb-1">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-hr-blue-light hover:text-hr-blue">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pr-10 ${errors.password ? 'border-hr-error' : 'border-hr-gray-border'}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-hr-error">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-hr-blue-light rounded border-hr-gray-border focus:ring-hr-blue-light"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-hr-gray-subtext">
                Remember me
              </label>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-hr-blue hover:bg-hr-blue-hover text-white py-3 rounded-md font-medium"
              disabled={loggingIn}
            >
              {loggingIn ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/" className="text-hr-blue-light hover:text-hr-blue">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
