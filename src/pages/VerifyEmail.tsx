
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { authApi } from '@/utils/api';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const email = location.state?.email || 'your email';
  
  // Check for token in URL params or search params
  const token = params.token || searchParams.get('token');

  // If token is present in URL, verify email
  useEffect(() => {
    if (token) {
      setVerifying(true);
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setVerifying(true);
    try {
      const response = await authApi.verifyEmail(verificationToken);
      
      toast({
        title: 'Email Verified',
        description: 'Your email has been successfully verified.',
      });
      
      // Navigate to welcome page after successful verification
      navigate('/welcome', { 
        state: { userId: response.userId, email: email }
      });
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'The verification link is invalid or has expired.',
        variant: 'destructive',
      });
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await authApi.resendVerification(email);
      
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

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
          {verifying ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-blue mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Verifying your email</h1>
              <p className="text-hr-gray-subtext">Please wait while we verify your email...</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
