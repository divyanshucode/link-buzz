'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Using div with proper styling instead of Label component
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';

interface ProfileEditModalProps {
  initialUsername: string;
}

export default function ProfileEditModal({ initialUsername }: ProfileEditModalProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validateUsername = (value: string): string => {
    if (value.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    return '';
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('One special character (@$!%*?&)');
    }
    
    return errors;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    const error = validateUsername(value);
    setErrors(prev => ({
      ...prev,
      username: error
    }));
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordErrors(validatePassword(value));
    
    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (newPassword && value !== newPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Validate username
      const usernameError = validateUsername(username);
      if (usernameError) {
        setErrors(prev => ({ ...prev, username: usernameError }));
        setIsLoading(false);
        return;
      }

      // Validate password if provided
      if (newPassword) {
        const passwordValidationErrors = validatePassword(newPassword);
        if (passwordValidationErrors.length > 0) {
          setErrors(prev => ({ ...prev, newPassword: 'Password does not meet requirements' }));
          setIsLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
          setIsLoading(false);
          return;
        }

        if (!currentPassword) {
          setErrors(prev => ({ ...prev, currentPassword: 'Current password is required to change password' }));
          setIsLoading(false);
          return;
        }
      }

      // Update username
      if (username !== initialUsername) {
        const usernameResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });

        const usernameData = await usernameResponse.json();
        if (!usernameResponse.ok) {
          setErrors(prev => ({ ...prev, username: usernameData.error }));
          setIsLoading(false);
          return;
        }
      }

      // Update password
      if (newPassword) {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const passwordData = await response.json();
        if (!response.ok) {
          setErrors(prev => ({ ...prev, currentPassword: passwordData.error }));
          setIsLoading(false);
          return;
        }
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        handleCancel();
        router.refresh();
      }, 1000);

    } catch (err) {
      setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(initialUsername);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setPasswordErrors([]);
    setSuccess('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50">
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Edit Profile</span>
          </DialogTitle>
          <DialogDescription>
            Update your username and password. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {errors.general && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.general}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Username Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <label htmlFor="username" className="text-sm font-medium">Username</label>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  @
                </span>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`pl-7 ${errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  placeholder="Enter username"
                />
              </div>
              
              {errors.username && (
                <div className="flex items-center space-x-2 text-red-600 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.username}</span>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                This will be your public profile URL: link-buzz.com/@{username}
              </div>
            </div>
          </div>

          <Separator />

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium">Change Password</label>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>

            <div className="space-y-3">
              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm text-gray-600">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.currentPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <div className="flex items-center space-x-2 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.currentPassword}</span>
                  </div>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm text-gray-600">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className={`pl-10 pr-10 ${passwordErrors.length > 0 && newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {newPassword && passwordErrors.length > 0 && (
                  <div className="space-y-1">
                    {passwordErrors.map((error, index) => (
                      <div key={index} className="flex items-center space-x-2 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>Missing: {error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {newPassword && passwordErrors.length === 0 && (
                  <div className="flex items-center space-x-2 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Password meets all requirements</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm text-gray-600">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center space-x-2 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
