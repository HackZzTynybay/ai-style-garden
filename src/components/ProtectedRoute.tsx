
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '@/utils/cookies';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    // Check if token exists in cookies
    const token = getCookie('authToken');
    
    // If no token is found, redirect to login page
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      setIsVerifying(false);
    }
  }, [navigate]);

  // Don't render children until verification is complete
  if (isVerifying) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
