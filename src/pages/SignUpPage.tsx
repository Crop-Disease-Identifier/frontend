import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleGoogleSignUp = () => {
    // Mock Google sign up
    console.log('Google sign up clicked');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Directly sign up without OTP
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      {/* Header */}
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
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8 border-green-100 dark:border-green-800 dark:bg-gray-800 shadow-lg">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-green-900 dark:text-green-100">Create Account</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Sign up to start identifying plant diseases
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

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

              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <div className="relative">
              <Separator className="bg-green-100 dark:bg-green-800" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-sm text-neutral-500 dark:text-neutral-400">
                Or continue with
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full border-green-200 dark:border-green-700 dark:hover:bg-green-900/20"
              onClick={handleGoogleSignUp}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Login
                </Link>
              </p>
            </div>

            <div className="pt-4 border-t border-green-100 dark:border-green-800">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}