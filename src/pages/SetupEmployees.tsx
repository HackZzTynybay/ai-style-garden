
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import DepartmentSidebar from '@/components/DepartmentSidebar';
import { useNavigate } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { toast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
}

const SetupEmployees = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    position: ''
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name.trim() || !newEmployee.email.trim()) {
      toast({
        title: "Error",
        description: "Employee name and email are required",
        variant: "destructive",
      });
      return;
    }

    const employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      department: newEmployee.department,
      position: newEmployee.position
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', email: '', department: '', position: '' });
    setIsAddOpen(false);
    
    toast({
      title: "Success",
      description: `${employee.name} has been added`,
    });
  };

  const AddEmployeeForm = () => (
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="employeeName">Employee Name*</Label>
        <Input
          id="employeeName"
          placeholder="Enter employee name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employeeEmail">Email Address*</Label>
        <Input
          id="employeeEmail"
          type="email"
          placeholder="person@example.com"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employeeDepartment">Department</Label>
        <Input
          id="employeeDepartment"
          placeholder="Select department"
          value={newEmployee.department}
          onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeePosition">Position</Label>
        <Input
          id="employeePosition"
          placeholder="Enter position"
          value={newEmployee.position}
          onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
        />
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-hr-gray-light">
      {/* Sidebar */}
      <DepartmentSidebar currentStep="employees" />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <header className="mb-4 md:mb-6 md:hidden">
          <Logo />
        </header>
        
        <div className="max-w-4xl mx-auto mt-4 md:mt-8">
          <h1 className="text-xl md:text-2xl font-semibold text-hr-gray-text">Set Up Employees</h1>
          <p className="text-sm md:text-base text-hr-gray-subtext mt-1 mb-4 md:mb-6">Add employees to your organization</p>
          
          <div className="bg-white border border-hr-gray-border rounded-md p-4 md:p-6 min-h-[250px] md:min-h-[300px] mb-4 md:mb-6">
            {employees.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {employees.map(emp => (
                  <div key={emp.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-hr-gray-border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-hr-gray-light p-2 rounded-full">
                        <User size={isMobile ? 16 : 20} className="text-hr-gray-text" />
                      </div>
                      <div>
                        <h3 className="font-medium text-hr-gray-text">{emp.name}</h3>
                        <p className="text-xs md:text-sm text-hr-gray-subtext">{emp.email}</p>
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-hr-gray-subtext mt-2 md:mt-0 flex flex-col md:flex-row md:gap-4">
                      {emp.department && <span>Department: {emp.department}</span>}
                      {emp.position && <span>Position: {emp.position}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm md:text-base text-hr-gray-subtext">No employees added yet</p>
              </div>
            )}
            
            {isMobile ? (
              // Mobile: Show as a drawer (popup from bottom)
              <Drawer open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DrawerTrigger asChild>
                  <button 
                    className="w-full flex items-center justify-center gap-2 py-3 md:py-4 mt-4 text-hr-gray-text border border-dashed border-hr-gray-border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                    <span className="text-sm">Add Employee</span>
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Add Employee</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <AddEmployeeForm />
                      <div className="flex justify-end gap-2 mt-6 pb-8">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddEmployee}
                          className="bg-hr-blue hover:bg-hr-blue-hover"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              // Desktop: Show as a sheet (slide from right)
              <>
                <button 
                  onClick={() => setIsAddOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 md:py-4 mt-4 text-hr-gray-text border border-dashed border-hr-gray-border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Plus size={20} />
                  <span className="text-base">Add Employee</span>
                </button>
                
                <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Add Employee</SheetTitle>
                    </SheetHeader>
                    <AddEmployeeForm />
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddEmployee}
                        className="bg-hr-blue hover:bg-hr-blue-hover"
                      >
                        Save
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 md:gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="px-4 md:px-8 text-sm md:text-base"
            >
              Skip
            </Button>
            
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-hr-blue hover:bg-hr-blue-hover px-4 md:px-8 text-sm md:text-base"
            >
              Finish Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupEmployees;
