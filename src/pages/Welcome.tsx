
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { CheckCircle } from 'lucide-react';

const Welcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your account';

  const handleContinueToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-hr-gray-text mb-4">Welcome to EasyHR!</h1>
          
          <p className="text-hr-gray-subtext mb-8">
            Thank you for verifying {email}. Your account is now active.
            You can now login and start using our HR management platform.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleContinueToLogin}
              className="w-full py-6"
            >
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
