
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth?mode=login');
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">HealthMoniTree</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/health-data">
              <Button variant="ghost">Health Data</Button>
            </Link>
            <Link to="/patient-records">
              <Button variant="ghost">Records</Button>
            </Link>
            <Link to="/medications">
              <Button variant="ghost">Medications</Button>
            </Link>
            <Link to="/appointments">
              <Button variant="ghost">Appointments</Button>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-green-700 hidden md:block">
                  <User className="inline mr-1 h-4 w-4" /> 
                  {user.email}
                </div>
                <Button onClick={handleSignOut} variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
