
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface Department {
  id: string;
  name: string;
  email: string;
  lead: string;
}

const SetupDepartments = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    email: '',
    lead: ''
  });

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    const department = {
      id: Date.now().toString(),
      name: newDepartment.name,
      email: newDepartment.email,
      lead: newDepartment.lead
    };

    setDepartments([...departments, department]);
    setNewDepartment({ name: '', email: '', lead: '' });
    setIsAddSheetOpen(false);
    
    toast({
      title: "Success",
      description: `${department.name} department has been added`,
    });
  };

  const handleSaveAndNext = () => {
    // In a real application, we would save the departments to the backend here
    toast({
      title: "Success",
      description: "Departments saved successfully",
    });
    navigate('/setup-roles'); // Navigate to the next setup step
  };

  const handleSkip = () => {
    navigate('/setup-roles'); // Navigate to the next setup step
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
          
          <div className="max-w-3xl mx-auto mt-4 md:mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
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
            
            {/* Departments Container */}
            <div className="bg-white border border-hr-gray-border rounded-md p-6 min-h-[250px] mb-6">
              {departments.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {departments.map(dept => (
                    <div key={dept.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-hr-gray-border rounded-md">
                      <div>
                        <h3 className="font-medium text-hr-gray-text">{dept.name}</h3>
                        {dept.email && <p className="text-xs text-hr-gray-subtext">{dept.email}</p>}
                      </div>
                      {dept.lead && <div className="text-xs text-hr-gray-subtext mt-1 md:mt-0">Lead: {dept.lead}</div>}
                    </div>
                  ))}
                </div>
              ) : null}
              
              {/* Add Department Button - Smaller */}
              <button 
                onClick={() => setIsAddSheetOpen(true)}
                className="flex items-center justify-center gap-2 mx-auto py-2 px-4 text-hr-gray-text border border-dashed border-hr-gray-border rounded-md hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
                <span className="text-sm">Add Department</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Department Sheet */}
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add Department</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="departmentName">Department Name*</Label>
                <Input
                  id="departmentName"
                  placeholder="Enter department name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupEmail">Group email</Label>
                <Input
                  id="groupEmail"
                  type="email"
                  placeholder="person@example.com"
                  value={newDepartment.email}
                  onChange={(e) => setNewDepartment({...newDepartment, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departmentLead">Department Lead</Label>
                <Input
                  id="departmentLead"
                  placeholder="Search employee"
                  value={newDepartment.lead}
                  onChange={(e) => setNewDepartment({...newDepartment, lead: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAddSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddDepartment}
                className="bg-hr-blue hover:bg-hr-blue-hover"
              >
                Save
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SetupDepartments;
