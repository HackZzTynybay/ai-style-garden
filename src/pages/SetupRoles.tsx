
import React from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const SetupRoles = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      {/* Mobile Sidebar */}
      {isMobile && <DepartmentSidebar currentStep="roles" />}
      
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Desktop Sidebar */}
        {!isMobile && <DepartmentSidebar currentStep="roles" />}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {isMobile && (
            <header className="mb-4">
              <Logo />
            </header>
          )}
          
          <div className="max-w-3xl mx-auto mt-4 md:mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-hr-gray-text">Set Up Roles and Permissions</h1>
                <p className="text-sm text-hr-gray-subtext mt-1">Define roles and assign permissions for your organization</p>
              </div>
              
              <div className="flex mt-4 md:mt-0 space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/setup-employees')}
                  className="px-5 py-2 h-auto text-sm"
                >
                  Skip
                </Button>
                
                <Button
                  onClick={() => navigate('/setup-employees')}
                  className="bg-hr-blue hover:bg-hr-blue-hover px-5 py-2 h-auto text-sm"
                >
                  Save & Next
                </Button>
              </div>
            </div>
            
            <div className="bg-white border border-hr-gray-border rounded-md p-6 min-h-[250px] flex items-center justify-center">
              <p className="text-sm text-hr-gray-subtext">Roles and permissions setup will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupRoles;
