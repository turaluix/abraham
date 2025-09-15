"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authApi } from '@/api';
import { ProfileUpdateRequest } from '@/types';

interface ProfileCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
}

export function ProfileCompletionDialog({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userEmail
}: ProfileCompletionDialogProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Both first name and last name are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateData: ProfileUpdateRequest = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      };

      await authApi.updateProfile(updateData);
      
      // Reset form
      setFormData({ first_name: '', last_name: '' });
      
      // Call success callback
      onSuccess();
      
      // Close dialog
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ first_name: '', last_name: '' });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your first and last name to complete your profile setup.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.first_name.trim() || !formData.last_name.trim()}
            >
              {isLoading ? 'Updating...' : 'Complete Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
