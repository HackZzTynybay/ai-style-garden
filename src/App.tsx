
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Welcome from '@/pages/Welcome';
import CreatePassword from '@/pages/CreatePassword';
import EditEmail from '@/pages/EditEmail';
import VerifyEmail from '@/pages/VerifyEmail';
import EmailVerification from '@/pages/EmailVerification';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <div className="bg-hr-gray-light">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify-email/:token" element={<EmailVerification />} />
              <Route path="/edit-email" element={<EditEmail />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/welcome" 
                element={
                  <ProtectedRoute>
                    <Welcome />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
    </div>
  );
}

export default App;
