
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import { authApi } from '@/utils/api';

const CreatePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Get userId and email from location state
  const userId = location.state?.userId;
  const email = location.state?.email;
  
  // Redirect if no userId or email is present
  useEffect(() => {
    if (!userId || !email) {
      toast({
        title: 'Missing information',
        description: 'Please verify your email first',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [userId, email, navigate, toast]);

  // Password strength requirements
  const hasMinimumLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const allRequirementsMet = hasMinimumLength && hasUppercase && hasNumber && hasSpecialChar;
  
  const calculateStrength = () => {
    let count = 0;
    if (hasMinimumLength) count++;
    if (hasUppercase) count++;
    if (hasNumber) count++;
    if (hasSpecialChar) count++;
    
    if (count === 0) return 0;
    if (count === 1) return 25;
    if (count === 2) return 50;
    if (count === 3) return 75;
    return 100;
  };
  
  const strengthPercentage = calculateStrength();
  
  const getStrengthLabel = () => {
    if (strengthPercentage === 0) return 'Enter a password';
    if (strengthPercentage <= 25) return 'Weak password';
    if (strengthPercentage <= 50) return 'Fair password';
    if (strengthPercentage <= 75) return 'Good password';
    return 'Strong password';
  };
  
  const getStrengthColor = () => {
    if (strengthPercentage === 0) return 'bg-gray-200';
    if (strengthPercentage <= 25) return 'bg-red-500';
    if (strengthPercentage <= 50) return 'bg-yellow-500';
    if (strengthPercentage <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allRequirementsMet) {
      toast({
        title: 'Invalid password',
        description: 'Please meet all password requirements',
        variant: 'destructive',
      });
      return;
    }
    
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User information is missing. Please verify your email again.',
        variant: 'destructive',
      });
      return;
    }
    
    setCreating(true);
    try {
      await authApi.createPassword({
        userId,
        password
      });
      
      toast({
        title: 'Password created',
        description: 'Your account has been set up successfully',
      });
      
      navigate('/login', { state: { email } });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create password',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  // Don't render content if userId is missing
  if (!userId || !email) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Secure Your Account</h1>
          <p className="text-hr-gray-subtext mb-6">
            Set up your password
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-hr-gray-text mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${strengthPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2 text-hr-gray-subtext">
                  {getStrengthLabel()}
                </p>
              </div>
              
              <ul className="mt-4 space-y-2">
                <li className={`flex items-center text-sm ${hasMinimumLength ? 'text-hr-success' : 'text-hr-gray-subtext'}`}>
                  <Check size={16} className={`mr-2 ${hasMinimumLength ? 'text-hr-success' : 'text-gray-300'}`} />
                  At least 8 characters
                </li>
                <li className={`flex items-center text-sm ${hasUppercase ? 'text-hr-success' : 'text-hr-gray-subtext'}`}>
                  <Check size={16} className={`mr-2 ${hasUppercase ? 'text-hr-success' : 'text-gray-300'}`} />
                  One uppercase letter
                </li>
                <li className={`flex items-center text-sm ${hasNumber ? 'text-hr-success' : 'text-hr-gray-subtext'}`}>
                  <Check size={16} className={`mr-2 ${hasNumber ? 'text-hr-success' : 'text-gray-300'}`} />
                  One number
                </li>
                <li className={`flex items-center text-sm ${hasSpecialChar ? 'text-hr-success' : 'text-hr-gray-subtext'}`}>
                  <Check size={16} className={`mr-2 ${hasSpecialChar ? 'text-hr-success' : 'text-gray-300'}`} />
                  One special character
                </li>
              </ul>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-hr-blue hover:bg-hr-blue-hover text-white py-3 rounded-md font-medium mt-6"
              disabled={creating || !allRequirementsMet}
            >
              {creating ? 'Creating Password...' : 'Create Password'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-hr-blue-light hover:text-hr-blue">
                  Log In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
