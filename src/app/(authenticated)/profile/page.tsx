"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ProfileCompletionDialog } from '@/components/auth/profile-completion-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield, LogOut, Upload, Search, FileText, Building, Phone, Clock, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, refreshUser, isLoading } = useAuth();
  const router = useRouter();

  const needsProfileCompletion = user && (!user.first_name?.trim() || !user.last_name?.trim());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Unable to load user data.</p>
            <Button onClick={refreshUser} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {user.first_name || user.email}!
          </p>
        </div>
        <Button onClick={logout} variant="outline" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-sm">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Full Name</span>
                </div>
                <p className="text-sm">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.first_name || user.last_name || 'Not provided'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Role</span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {user.role?.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Account Status</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant={user.is_email_verified ? "default" : "destructive"}>
                    {user.is_email_verified ? 'Email Verified' : 'Email Unverified'}
                  </Badge>
                  <Badge variant={user.is_verified ? "default" : "secondary"}>
                    {user.is_verified ? 'Account Verified' : 'Account Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Your work details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Company</span>
                </div>
                <p className="text-sm">
                  {typeof user.company === 'string' 
                    ? user.company 
                    : (user.company as any)?.name || 'Not provided'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Department</span>
                </div>
                <p className="text-sm">{user.department || 'Not provided'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                <p className="text-sm">{user.phone || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>Account creation and update information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Member Since</span>
              </div>
              <p className="text-sm">
                {user.date_joined ? formatDate(user.date_joined) : 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Account Created</span>
              </div>
              <p className="text-sm">
                {user.created_at ? formatDateTime(user.created_at) : 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-sm">
                {user.updated_at ? formatDateTime(user.updated_at) : 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">User ID</span>
              </div>
              <p className="text-sm font-mono text-xs bg-muted px-2 py-1 rounded">
                {user.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Dialog */}
      {needsProfileCompletion && (
        <ProfileCompletionDialog
          isOpen={true}
          onClose={() => {}}
          onSuccess={refreshUser}
          userEmail={user.email}
        />
      )}
    </div>
  );
}
