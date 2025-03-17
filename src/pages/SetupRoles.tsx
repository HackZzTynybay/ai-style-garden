
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { departmentApi } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

const SetupRoles = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Fetch departments
  const { data: departmentsData, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await departmentApi.getDepartments();
      return response.data;
    }
  });
  
  return (
    <ProtectedRoute>
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
            
            <div className="max-w-4xl mx-auto mt-4 md:mt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
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
              
              <div className="bg-white rounded-md p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading departments...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-medium text-hr-gray-text">Department Roles</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      {/* Department Cards */}
                      {departmentsData && departmentsData.map((dept) => (
                        <Card key={dept.id} className="border border-hr-gray-border w-[180px]">
                          <CardContent className="p-4">
                            <div>
                              <h3 className="font-medium text-hr-gray-text">{dept.name}</h3>
                              <p className="text-xs text-hr-gray-subtext mt-1">No roles assigned</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Add Department Card */}
                      <Card 
                        className="border border-dashed border-hr-gray-border cursor-pointer hover:bg-gray-50 transition-colors w-[180px]"
                      >
                        <CardContent className="p-4 flex items-center justify-center">
                          <button className="flex items-center gap-2 text-hr-gray-text">
                            <Plus size={18} />
                            <span>Add Role</span>
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SetupRoles;
