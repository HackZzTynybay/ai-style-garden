import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/utils/api';

const formSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  workEmail: z.string().email({ message: "Please enter a valid work email" }),
  phoneNumber: z.string().optional(),
  companyId: z.string().min(5, { message: "Company ID is required" }),
  employeesCount: z.string().min(1, { message: "Please select number of employees" }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
});

type FormData = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      jobTitle: '',
      companyName: '',
      workEmail: '',
      phoneNumber: '',
      companyId: '',
      employeesCount: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Split fullName into firstName and lastName
      const nameParts = data.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // Prepare the data for the backend
      const userData = {
        firstName,
        lastName,
        email: data.workEmail,
        phoneNumber: data.phoneNumber || undefined,
        jobTitle: data.jobTitle,
        company: {
          name: data.companyName,
          companyId: data.companyId,
          employeesCount: data.employeesCount
        }
      };

      console.log('Submitting registration data:', userData);
      
      // Call the registration API
      const response = await authApi.register(userData);
      
      toast({
        title: "Account information submitted",
        description: "Please check your email for verification.",
      });
      
      // Navigate to email verification page
      navigate('/verify-email', { state: { email: data.workEmail } });
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hr-gray-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-hr-gray-text">Get Started</h1>
          <p className="text-sm text-hr-gray-subtext">Set up your HRMS administrator account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-hr-gray-text mb-4">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register('fullName')}
                    className={`w-full ${errors.fullName ? 'border-hr-error' : 'border-hr-gray-border'}`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-hr-error">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Your Job Title
                  </label>
                  <Input
                    id="jobTitle"
                    placeholder="Enter your job title"
                    {...register('jobTitle')}
                    className={`w-full ${errors.jobTitle ? 'border-hr-error' : 'border-hr-gray-border'}`}
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-xs text-hr-error">{errors.jobTitle.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-hr-gray-text mb-4">Company Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    {...register('companyName')}
                    className={`w-full ${errors.companyName ? 'border-hr-error' : 'border-hr-gray-border'}`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-hr-error">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="workEmail" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Work Email
                  </label>
                  <Input
                    id="workEmail"
                    type="email"
                    placeholder="your.name@company.com"
                    {...register('workEmail')}
                    className={`w-full ${errors.workEmail ? 'border-hr-error' : 'border-hr-gray-border'}`}
                  />
                  {errors.workEmail && (
                    <p className="mt-1 text-xs text-hr-error">{errors.workEmail.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Phone Number (Optional)
                  </label>
                  <Input
                    id="phoneNumber"
                    placeholder="+91 9876543210"
                    {...register('phoneNumber')}
                    className="w-full border-hr-gray-border"
                  />
                </div>
                
                <div>
                  <label htmlFor="companyId" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Company Identification Number
                  </label>
                  <Input
                    id="companyId"
                    placeholder="L12345MH2023PLC000789"
                    {...register('companyId')}
                    className={`w-full ${errors.companyId ? 'border-hr-error' : 'border-hr-gray-border'}`}
                  />
                  {errors.companyId && (
                    <p className="mt-1 text-xs text-hr-error">{errors.companyId.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="employeesCount" className="block text-sm font-medium text-hr-gray-text mb-1">
                    Number of Employees
                  </label>
                  <select
                    id="employeesCount"
                    {...register('employeesCount')}
                    className={`w-full rounded-md border ${
                      errors.employeesCount ? 'border-hr-error' : 'border-hr-gray-border'
                    } py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-hr-blue-light focus:border-transparent`}
                  >
                    <option value="">Select</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                  {errors.employeesCount && (
                    <p className="mt-1 text-xs text-hr-error">{errors.employeesCount.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <Checkbox
                id="termsAccepted"
                {...register('termsAccepted')}
                className={`${errors.termsAccepted ? 'border-hr-error' : 'border-hr-gray-border'}`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="termsAccepted" className="text-hr-gray-subtext">
                I agree to the{' '}
                <a href="#" className="text-hr-blue-light hover:text-hr-blue">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-hr-blue-light hover:text-hr-blue">
                  Privacy Policy
                </a>
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-xs text-hr-error">{errors.termsAccepted.message}</p>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-hr-blue hover:bg-hr-blue-hover text-white py-3 rounded-md font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-hr-blue-light hover:text-hr-blue">
                Log In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
