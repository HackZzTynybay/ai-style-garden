
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Logo from '@/components/Logo';

const formSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof formSchema>;

const EditEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const currentEmail = location.state?.email || 'johndoe@company.com';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Email updated',
        description: 'Verification email sent to your new address',
      });
      
      navigate('/verify-email', { state: { email: data.newEmail } });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update email address',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/verify-email', { state: { email: currentEmail } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-hr-gray-light">
      <header className="p-6">
        <Logo />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-hr-gray-text mb-2">Update your email address</h1>
          <p className="text-hr-gray-subtext mb-6">
            Please enter your new email address below
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentEmail" className="block text-sm font-medium text-hr-gray-text mb-1">
                Current email
              </label>
              <Input
                id="currentEmail"
                value={currentEmail}
                disabled
                className="w-full bg-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-hr-gray-text mb-1">
                New email address
              </label>
              <Input
                id="newEmail"
                placeholder="Enter your new email address"
                {...register('newEmail')}
                className={`w-full ${errors.newEmail ? 'border-hr-error' : 'border-hr-gray-border'}`}
              />
              {errors.newEmail && (
                <p className="mt-1 text-xs text-hr-error">{errors.newEmail.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-hr-blue hover:bg-hr-blue-hover text-white py-3 rounded-md font-medium"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmail;
