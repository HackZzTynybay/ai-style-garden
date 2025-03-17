
import React from 'react';
import Logo from './Logo';
import { Separator } from '@/components/ui/separator';

interface DepartmentSidebarProps {
  currentStep: 'departments' | 'roles' | 'employees';
}

const DepartmentSidebar = ({ currentStep }: DepartmentSidebarProps) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-hr-gray-border flex-shrink-0">
      <div className="p-4 mb-6">
        <Logo />
      </div>
      
      <div className="px-6">
        <div className="flex flex-col">
          {/* Setup Steps */}
          <div className="relative flex items-center gap-4 py-4">
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
          
          {/* Vertical line */}
          <div className="ml-3 w-px h-10 bg-hr-gray-border" />
          
          <div className="relative flex items-center gap-4 py-4">
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
          
          {/* Vertical line */}
          <div className="ml-3 w-px h-10 bg-hr-gray-border" />
          
          <div className="relative flex items-center gap-4 py-4">
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
      </div>
    </div>
  );
};

export default DepartmentSidebar;
