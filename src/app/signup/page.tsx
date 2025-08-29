'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertTriangle,
  Sparkles,
  CheckCircle,
  UserPlus
} from 'lucide-react';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate password
    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setError('Please fix password requirements before continuing.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <Card className="glass border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6 px-4 sm:px-6">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
              Create Your Account
            </CardTitle>
            <p className="text-sm sm:text-base text-white/80">Join Link-Buzz and share your links</p>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mx-auto mt-3">
              <Sparkles className="w-4 h-4 mr-2" />
              Free Forever
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {error && (
              <div className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 text-red-300 mr-2" />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white/90">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 ${passwordErrors.length > 0 && password ? 'border-red-400 focus:border-red-500' : ''}`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {password && passwordErrors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordErrors.map((error, index) => (
                      <div key={index} className="flex items-center space-x-2 text-red-300 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Missing: {error}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {password && passwordErrors.length === 0 && (
                  <div className="mt-2 flex items-center space-x-2 text-green-300 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Password meets all requirements</span>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2 py-2">
                <div className="flex items-center text-white/70 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Unlimited links</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Custom profile page</span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-2.5 sm:py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="bg-white/20" />

            <div className="text-center">
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-white font-semibold hover:text-yellow-200 transition-colors underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/" 
                className="text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}