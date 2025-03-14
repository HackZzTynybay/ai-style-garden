
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '@/components/RegistrationForm';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-hr-gray-light">
      <RegistrationForm />
    </div>
  );
};

export default Index;
