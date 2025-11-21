import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

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

            <div className="text-center">
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