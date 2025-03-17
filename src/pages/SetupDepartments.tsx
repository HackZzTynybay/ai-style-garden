
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Department {
  id: string;
  name: string;
  email: string;
  lead: string;
}

const SetupDepartments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
    setIsAddDialogOpen(false);
    
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
    <div className="min-h-screen flex bg-hr-gray-light">
      {/* Sidebar */}
      <DepartmentSidebar currentStep="departments" />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <header className="mb-6">
          <Logo />
        </header>
        
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-2xl font-semibold text-hr-gray-text">Set Up Your Departments</h1>
          <p className="text-hr-gray-subtext mt-1 mb-6">Create and organize your company's department structure</p>
          
          {/* Departments Container */}
          <div className="bg-white border border-hr-gray-border rounded-md p-6 min-h-[300px] mb-6">
            {departments.length > 0 ? (
              <div className="space-y-4">
                {departments.map(dept => (
                  <div key={dept.id} className="flex items-center justify-between p-3 border border-hr-gray-border rounded-md">
                    <div>
                      <h3 className="font-medium text-hr-gray-text">{dept.name}</h3>
                      {dept.email && <p className="text-sm text-hr-gray-subtext">{dept.email}</p>}
                    </div>
                    {dept.lead && <div className="text-sm text-hr-gray-subtext">Lead: {dept.lead}</div>}
                  </div>
                ))}
              </div>
            ) : null}
            
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 mt-4 text-hr-gray-text border border-dashed border-hr-gray-border rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus size={20} />
              <span>Add Department</span>
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="px-8"
            >
              Skip
            </Button>
            
            <Button
              onClick={handleSaveAndNext}
              className="bg-hr-blue hover:bg-hr-blue-hover px-8"
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
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
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SetupDepartments;
