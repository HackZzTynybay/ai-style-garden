
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '@/utils/cookies';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if token exists in cookies
    const token = getCookie('authToken');
    
    // If no token is found, redirect to login page
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
