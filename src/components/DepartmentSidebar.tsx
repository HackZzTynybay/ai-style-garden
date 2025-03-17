
import React from 'react';
import Logo from './Logo';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface DepartmentSidebarProps {
  currentStep: 'departments' | 'roles' | 'employees';
}

const DepartmentSidebar = ({ currentStep }: DepartmentSidebarProps) => {
  const isMobile = useIsMobile();
  
  const stepsContent = (
    <div className={`flex ${isMobile ? 'flex-row justify-center gap-8' : 'flex-col gap-6'} px-6 py-4`}>
      {/* Departments Step */}
      <div className="relative flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          currentStep === 'departments' ? 'bg-hr-blue' : 'bg-hr-gray-light'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === 'departments' ? 'bg-white' : 'bg-hr-gray-subtext'
          }`} />
        </div>
        <span className={`font-medium ${
          currentStep === 'departments' ? 'text-hr-gray-text' : 'text-hr-gray-subtext'
        }`}>
          Departments
        </span>
      </div>
      
      {/* Roles Step */}
      <div className="relative flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          currentStep === 'roles' ? 'bg-hr-blue' : 'bg-hr-gray-light'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === 'roles' ? 'bg-white' : 'bg-hr-gray-subtext'
          }`} />
        </div>
        <span className={`font-medium ${
          currentStep === 'roles' ? 'text-hr-gray-text' : 'text-hr-gray-subtext'
        }`}>
          Roles and Permissions
        </span>
      </div>
      
      {/* Employees Step */}
      <div className="relative flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          currentStep === 'employees' ? 'bg-hr-blue' : 'bg-hr-gray-light'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === 'employees' ? 'bg-white' : 'bg-hr-gray-subtext'
          }`} />
        </div>
        <span className={`font-medium ${
          currentStep === 'employees' ? 'text-hr-gray-text' : 'text-hr-gray-subtext'
        }`}>
          Employees
        </span>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full py-4 bg-white border-b border-hr-gray-border">
        <div className="px-4">
          {stepsContent}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block w-64 h-screen bg-white border-r border-hr-gray-border flex-shrink-0">
      <div className="p-6 mb-4">
        <Logo />
      </div>
      
      {stepsContent}
    </div>
  );
};

export default DepartmentSidebar;
