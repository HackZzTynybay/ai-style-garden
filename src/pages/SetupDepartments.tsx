
import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { departmentApi, Department } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';

const SetupDepartments = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lead: ''
  });

  // Fetch departments
  const { data: departmentsData, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await departmentApi.getDepartments();
      return response.data as Department[];
    }
  });

  // Create department mutation
  const createDepartmentMutation = useMutation({
    mutationFn: (data: { name: string; email?: string; lead?: string }) => 
      departmentApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setIsAddSheetOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: `${formData.name} department has been added`,
      });
    }
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string; lead?: string } }) => 
      departmentApi.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setIsAddSheetOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: `Department has been updated`,
      });
    }
  });

  // Delete department mutation
  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => departmentApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department has been deleted",
      });
    }
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', lead: '' });
    setIsEditMode(false);
    setSelectedDeptId(null);
  };

  const handleOpenAddSheet = () => {
    resetForm();
    setIsAddSheetOpen(true);
  };

  const handleOpenEditSheet = (dept: Department) => {
    setFormData({
      name: dept.name,
      email: dept.email || '',
      lead: dept.lead || ''
    });
    setSelectedDeptId(dept.id);
    setIsEditMode(true);
    setIsAddSheetOpen(true);
  };

  const handleFormSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && selectedDeptId) {
      updateDepartmentMutation.mutate({ 
        id: selectedDeptId, 
        data: formData
      });
    } else {
      createDepartmentMutation.mutate(formData);
    }
  };

  const handleDeleteDepartment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartmentMutation.mutate(id);
    }
  };

  const handleSaveAndNext = () => {
    toast({
      title: "Success",
      description: "Departments saved successfully",
    });
    navigate('/setup-roles');
  };

  const handleSkip = () => {
    navigate('/setup-roles');
  };

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      {/* Mobile Sidebar */}
      {isMobile && <DepartmentSidebar currentStep="departments" />}
      
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Desktop Sidebar */}
        {!isMobile && <DepartmentSidebar currentStep="departments" />}

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
                <h1 className="text-xl md:text-2xl font-semibold text-hr-gray-text">Set Up Your Departments</h1>
                <p className="text-sm text-hr-gray-subtext mt-1">Create and organize your company's department structure</p>
              </div>
              
              <div className="flex mt-4 md:mt-0 space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="px-5 py-2 h-auto text-sm"
                >
                  Skip
                </Button>
                
                <Button
                  onClick={handleSaveAndNext}
                  className="bg-hr-blue hover:bg-hr-blue-hover px-5 py-2 h-auto text-sm"
                >
                  Save & Next
                </Button>
              </div>
            </div>
            
            {/* Departments Grid */}
            <div className="bg-white rounded-md p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading departments...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  <p>Error loading departments. Please try again.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Department Cards */}
                  {departmentsData && departmentsData.map((dept) => (
                    <Card key={dept.id} className="border border-hr-gray-border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-hr-gray-text">{dept.name}</h3>
                            {dept.email && (
                              <p className="text-xs text-hr-gray-subtext mt-1">{dept.email}</p>
                            )}
                          </div>
                          <div className="flex">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenEditSheet(dept)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit size={16} className="text-hr-gray-text" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDepartment(dept.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add Department Card */}
                  <Card 
                    className="border border-dashed border-hr-gray-border cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleOpenAddSheet}
                  >
                    <CardContent className="p-4 flex items-center justify-center">
                      <button className="flex items-center gap-2 text-hr-gray-text">
                        <Plus size={18} />
                        <span>Add Department</span>
                      </button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Department Sheet */}
        <Sheet open={isAddSheetOpen} onOpenChange={(open) => {
          setIsAddSheetOpen(open);
          if (!open) resetForm();
        }}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{isEditMode ? 'Edit Department' : 'Add Department'}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="departmentName">Department Name*</Label>
                <Input
                  id="departmentName"
                  placeholder="Enter department name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupEmail">Group email</Label>
                <Input
                  id="groupEmail"
                  type="email"
                  placeholder="person@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departmentLead">Department Lead</Label>
                <Input
                  id="departmentLead"
                  placeholder="Search employee"
                  value={formData.lead}
                  onChange={(e) => setFormData({...formData, lead: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddSheetOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                className="bg-hr-blue hover:bg-hr-blue-hover"
                disabled={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}
              >
                {createDepartmentMutation.isPending || updateDepartmentMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SetupDepartments;
