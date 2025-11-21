import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import ThemeToggle from '../components/ThemeToggle';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(location.state?.step || 1);
  const [email, setEmail] = useState(location.state?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Email Input
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    navigate('/verify-otp', { state: { email, isResetPassword: true } });
  };

  // Step 3: New Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setStep(4);
  };

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
        <header className="border-b border-green-100 dark:border-green-900 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-2">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-green-900 dark:text-green-100">CDI</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 border-green-100 dark:border-green-800 dark:bg-gray-800 shadow-lg text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-green-900 dark:text-green-100 mb-3">Password Reset Successful!</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link to="/login">Go to Login</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Step 3: New Password Form
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
        <header className="border-b border-green-100 dark:border-green-900 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-2">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-green-900 dark:text-green-100">CDI</span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8 border-green-100 dark:border-green-800 dark:bg-gray-800 shadow-lg">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                  <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-green-900 dark:text-green-100">Set New Password</h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Choose a strong password for your account
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">Password must contain:</p>
                  <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li>• At least 8 characters</li>
                    <li>• One uppercase letter</li>
                    <li>• One number</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Step 1: Email Input
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <header className="border-b border-green-100 dark:border-green-900 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full bg-green-500 p-2">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-green-900 dark:text-green-100">CDI</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8 border-green-100 dark:border-green-800 dark:bg-gray-800 shadow-lg">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-green-900 dark:text-green-100">Reset Password</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Enter your email address and we'll send you a verification code
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Remember your password?{' '}
                <Link to="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}