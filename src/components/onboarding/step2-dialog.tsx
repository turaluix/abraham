"use client";

import { useState } from 'react';
import { onboardingApi } from '@/api';
import { OnboardingStep2Request } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Globe, Phone, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Step2DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OnboardingStep2Dialog({ isOpen, onClose, onSuccess }: Step2DialogProps) {
  const [formData, setFormData] = useState<OnboardingStep2Request>({
    company_name: '',
    website: '',
    country: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'company_logo' | 'ai_avatar_logo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onboardingApi.step2(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete company setup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Complete Your Company Setup
          </DialogTitle>
          <DialogDescription>
            Please provide your company information to continue using the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="company_name">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company_name"
              name="company_name"
              placeholder="Enter your company name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">
              Website <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourcompany.com"
                className="pl-10"
                value={formData.website}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                name="country"
                placeholder="United States"
                value={formData.country}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_logo">
              Company Logo <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="company_logo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'company_logo')}
                disabled={isLoading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('company_logo')?.click()}
                disabled={isLoading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {formData.company_logo ? 'Logo Selected' : 'Upload Company Logo'}
              </Button>
            </div>
            {formData.company_logo && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.company_logo.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai_avatar_logo">
              AI Avatar Logo <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="ai_avatar_logo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'ai_avatar_logo')}
                disabled={isLoading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('ai_avatar_logo')?.click()}
                disabled={isLoading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {formData.ai_avatar_logo ? 'Avatar Selected' : 'Upload AI Avatar Logo'}
              </Button>
            </div>
            {formData.ai_avatar_logo && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.ai_avatar_logo.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.company_name.trim() ||
                !formData.website.trim() ||
                !formData.country.trim() ||
                !formData.phone.trim() ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting Up...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
