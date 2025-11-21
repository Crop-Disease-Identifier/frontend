import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();
  
  const email = location.state?.email || 'user@example.com';
  const isSignUp = location.state?.isSignUp || false;
  const isResetPassword = location.state?.isResetPassword || false;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setVerified(true);

    // Navigate based on context
    setTimeout(() => {
      if (isResetPassword) {
        navigate('/reset-password', { state: { step: 3, email } });
      } else if (isSignUp) {
        signup(email, 'password');
        navigate('/dashboard');
      }
    }, 1500);
  };

  const handleResend = () => {
    setResendTimer(30);
    // Mock resend
    console.log('OTP resent');
  };

  if (verified) {
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
            <h2 className="text-green-900 dark:text-green-100 mb-3">Verified Successfully!</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {isResetPassword
                ? 'Your identity has been verified. Redirecting to password reset...'
                : 'Your email has been verified. Redirecting to dashboard...'}
            </p>
          </Card>
        </main>
      </div>
    );
  }

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
                <Link to={isSignUp ? '/signup' : '/login'}>
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
              <h1 className="text-green-900 dark:text-green-100">Verify Your Email</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                We've sent a 6-digit code to{' '}
                <span className="text-green-600 dark:text-green-400">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center rounded-lg border-2 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors dark:bg-gray-900 dark:text-white"
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || otp.some(d => !d)}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Resend code in <span className="text-green-600 dark:text-green-400">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}