
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { CheckCircle } from 'lucide-react';
import { getCookie } from '@/utils/cookies';
import { userApi } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

const Welcome = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('User');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data using the auth token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('authToken');
        
        if (token) {
          // Fetch user data from API using token
          const response = await userApi.getCurrentUser();
          if (response.success && response.data) {
            setFirstName(response.data.firstName || 'User');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
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
          
          {isLoading ? (
            <p className="text-hr-gray-subtext mb-8">Loading your information...</p>
          ) : (
            <p className="text-hr-gray-subtext mb-8">
              Hi {firstName}, your account has been successfully set up. You can now start using the EaseHR platform to manage your HR needs.
            </p>
          )}
          
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
