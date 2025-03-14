
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { CheckCircle } from 'lucide-react';

const Welcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user data from location state
  const userData = location.state || {};
  const firstName = userData.firstName || 'User';
  
  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={60} className="text-hr-success" />
          </div>
          
          <h1 className="text-2xl font-bold text-hr-gray-text mb-4">Welcome to EaseHR!</h1>
          
          <p className="text-hr-gray-subtext mb-8">
            Hi {firstName}, your account has been successfully set up. You can now start using the EaseHR platform to manage your HR needs.
          </p>
          
          <div className="space-y-4">
            <Button
              className="w-full bg-hr-blue hover:bg-hr-blue-hover text-white py-3 rounded-md font-medium"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-3"
              onClick={() => navigate('/profile')}
            >
              Complete Your Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
