import { useState } from 'react';
import { User, Mail, Lock, LogOut, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import Header from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSaveName = () => {
    if (user) {
      updateUser({ ...user, name });
      setIsEditingName(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Mock password change
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-green-900 dark:text-green-100 mb-2">Profile Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Information */}
        <Card className="p-6 border-green-100 dark:border-green-800 dark:bg-gray-800 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-20 h-20 flex items-center justify-center">
              <User className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-green-900 dark:text-green-100 mb-1">{user?.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{user?.email}</p>
            </div>
          </div>

          <Separator className="my-6 bg-green-100 dark:bg-green-800" />

          {/* Name Edit */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">Full Name</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditingName}
                    className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
                {!isEditingName ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingName(true)}
                    className="border-green-200 dark:border-green-700"
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveName}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setName(user?.name || '');
                        setIsEditingName(false);
                      }}
                      className="border-green-200 dark:border-green-700"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
              {saved && (
                <p className="text-sm text-green-600 mt-2">✓ Name updated successfully</p>
              )}
            </div>

            {/* Email Display */}
            <div>
              <label className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                <Input
                  type="email"
                  value={user?.email}
                  disabled
                  className="pl-10 border-green-200 bg-neutral-50 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
        </Card>

        {/* Password Section */}
        <Card className="p-6 border-green-100 dark:border-green-800 dark:bg-gray-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-green-900 dark:text-green-100 mb-1">Password</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          {!showPasswordForm ? (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
              className="border-green-200 dark:border-green-700"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

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
                  Confirm New Password
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

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="border-green-200 dark:border-green-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Logout Section */}
        <Card className="p-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-neutral-900 dark:text-neutral-100 mb-1">Logout</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Sign out of your account
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(true)}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-100 dark:hover:bg-red-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will log you out of your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}