
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);
  const email = location.state?.email || 'your email';

  const handleResendEmail = async () => {
    setResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Verification email resent',
        description: 'Please check your inbox',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend verification email',
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  const handleEditEmail = () => {
    navigate('/edit-email', { state: { email } });
  };

  // In a real app, you would implement a check for the verification link here
  // For this demo, we'll simulate successful verification after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment to auto-redirect (for demo purposes)
      // navigate('/create-password');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Verify your email to continue</h1>
          <p className="text-hr-gray-subtext mb-6">
            We sent a verification link to {email}.<br />
            Check your inbox.
          </p>
          
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full mb-4 py-6"
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend Email'}
          </Button>
          
          <Button
            onClick={handleEditEmail}
            variant="link"
            className="w-full text-hr-blue-light hover:text-hr-blue"
          >
            Edit Email Address
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
