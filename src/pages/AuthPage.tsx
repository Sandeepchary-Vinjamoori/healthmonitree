
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();

  // Get mode from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'signup') {
      setActiveTab('signup');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome back to HealthMoniTree!",
      });
      // Redirect to main app
      window.location.href = '/health-data';
    }, 2000);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Welcome to HealthMoniTree! You can now access your dashboard.",
      });
      // Redirect to main app
      window.location.href = '/health-data';
    }, 2000);
  };

  const goBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={goBack}
            className="text-white hover:text-blue-200 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">
                HealthMoniTree
              </CardTitle>
              <CardDescription className="text-blue-200">
                Access your health monitoring dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="login" className="text-white data-[state=active]:bg-blue-600">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-white data-[state=active]:bg-blue-600">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
