import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User, History, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import ThemeToggle from '../ThemeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setShowLogoutDialog(false);
  };

  const openLogoutDialog = () => {
    setShowLogoutDialog(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 dark:border-green-900 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 p-2">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-green-900 dark:text-green-100">CDI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/chat-history">
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <ThemeToggle />
                <Button variant="outline" onClick={openLogoutDialog} className="border-green-200 dark:border-green-700 dark:hover:bg-green-900/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <ThemeToggle />
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/waitlist">Join Waitlist</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-green-100 dark:border-green-900">
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/chat-history">
                      <History className="mr-2 h-4 w-4" />
                      History
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={openLogoutDialog} className="justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <ThemeToggle />
                  <Button asChild className="bg-green-600 hover:bg-green-700" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/waitlist">Join Waitlist</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}