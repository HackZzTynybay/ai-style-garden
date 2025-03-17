
import React from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { useNavigate } from 'react-router-dom';

const SetupRoles = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-hr-gray-light">
      {/* Sidebar */}
      <DepartmentSidebar currentStep="roles" />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <header className="mb-4 md:mb-6">
          <Logo />
        </header>
        
        <div className="max-w-4xl mx-auto mt-4 md:mt-8">
          <h1 className="text-xl md:text-2xl font-semibold text-hr-gray-text">Set Up Roles and Permissions</h1>
          <p className="text-sm md:text-base text-hr-gray-subtext mt-1 mb-4 md:mb-6">Define roles and assign permissions for your organization</p>
          
          <div className="bg-white border border-hr-gray-border rounded-md p-4 md:p-8 min-h-[250px] md:min-h-[300px] mb-4 md:mb-6 flex items-center justify-center">
            <p className="text-sm md:text-base text-hr-gray-subtext">Roles and permissions setup will be implemented here</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 md:gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/setup-employees')}
              className="px-4 md:px-8 text-sm md:text-base"
            >
              Skip
            </Button>
            
            <Button
              onClick={() => navigate('/setup-employees')}
              className="bg-hr-blue hover:bg-hr-blue-hover px-4 md:px-8 text-sm md:text-base"
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupRoles;
