
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setVerificationStatus('success');
        setUserId(response.userId || null);
        setEmail(response.email || null);
        
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified.',
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          if (response.userId && response.email) {
            navigate('/create-password', { 
              state: { 
                userId: response.userId,
                email: response.email
              } 
            });
          } else {
            navigate('/login');
          }
        }, 2000);
      } catch (error) {
        setVerificationStatus('error');
        
        toast({
          title: 'Verification Failed',
          description: 'The verification link is invalid or has expired.',
          variant: 'destructive',
        });
      }
    };

    verifyEmailToken();
  }, [token, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md text-center">
          {verificationStatus === 'loading' && (
            <div className="py-8 animate-pulse">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-blue mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Verifying Your Email</h1>
              <p className="text-hr-gray-subtext">Please wait while we verify your email...</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="py-8 animate-fade-in">
              <div className="mx-auto w-16 h-16 mb-4 text-green-500">
                <CheckCircle size={64} className="animate-scale-in" />
              </div>
              <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Email Verified!</h1>
              <p className="text-hr-gray-subtext mb-4">Your email has been successfully verified.</p>
              <Alert>
                <AlertTitle>Redirecting...</AlertTitle>
                <AlertDescription>
                  You will be redirected to create your password in a moment.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="py-8 animate-fade-in">
              <div className="mx-auto w-16 h-16 mb-4 text-red-500">
                <XCircle size={64} className="animate-scale-in" />
              </div>
              <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Verification Failed</h1>
              <p className="text-hr-gray-subtext mb-4">
                The verification link is invalid or has expired.
              </p>
              <button
                onClick={() => navigate('/verify-email')}
                className="mt-4 text-hr-blue hover:text-hr-blue-hover underline"
              >
                Go to verification page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
