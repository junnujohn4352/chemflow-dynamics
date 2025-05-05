
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { KeySquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

const CodeVerification: React.FC = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  
  // Default activation code for direct access
  const defaultActivationCode = "12345678";
  
  useEffect(() => {
    // Check if already logged in
    const activated = localStorage.getItem('chemflow-activated');
    if (activated === 'true') {
      navigate('/dashboard');
      return;
    }
    
    // Get the stored activation code or use the default
    const storedCode = localStorage.getItem('chemflow-activation-code') || defaultActivationCode;
    
    // Store the default activation code if none exists
    if (!localStorage.getItem('chemflow-activation-code')) {
      localStorage.setItem('chemflow-activation-code', defaultActivationCode);
    }
    
    // Check if this is likely a returning user
    const isReturningUser = localStorage.getItem('chemflow-accessed-before') === 'true';
    setIsLogin(isReturningUser);
    
    // Mark that the app has been accessed before
    localStorage.setItem('chemflow-accessed-before', 'true');
  }, [navigate]);
  
  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activationCode.trim()) {
      toast.error("Please enter your activation code");
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      // Check if the entered code matches the stored/default code
      const storedActivationCode = localStorage.getItem('chemflow-activation-code') || defaultActivationCode;
      
      if (activationCode === storedActivationCode) {
        // Set activation status in localStorage
        localStorage.setItem('chemflow-activated', 'true');
        
        setIsActivated(true);
        
        if (isLogin) {
          toast.success("Login successful! Welcome back.");
        } else {
          toast.success("Application successfully activated!");
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(isLogin ? "Invalid login code. Please try again." : "Invalid activation code. Please try again.");
        setIsVerifying(false);
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center">
          <ChemFlowLogo className="h-10 w-auto mr-2" />
          <span className="text-2xl font-semibold text-gray-800">ChemFlow</span>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardContent className="p-8">
            {!isActivated ? (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="p-3 rounded-full bg-blue-100 mb-4">
                    <KeySquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    {isLogin ? "Login to ChemFlow" : "Activate ChemFlow"}
                  </h2>
                  <p className="text-gray-600 text-center mt-2">
                    {isLogin 
                      ? "Enter your unique code to access the application" 
                      : "Enter your activation code to get started"}
                  </p>
                </div>
                
                <form onSubmit={handleActivation} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="activation-code" className="text-gray-700">
                      {isLogin ? "Access Code" : "Activation Code"}
                    </Label>
                    
                    <div className="flex justify-center mb-6">
                      <InputOTP maxLength={8} value={activationCode} onChange={setActivationCode}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                          <InputOTPSlot index={7} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    
                    <p className="text-sm text-gray-500 text-center mt-2">
                      {isLogin 
                        ? "The default code is 12345678 if you haven't set one"
                        : "The default activation code is 12345678"}
                    </p>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 rounded-md"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {isLogin ? "Logging in..." : "Verifying..."}
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        {isLogin ? "Log In" : "Activate Software"} <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Default code: 12345678
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  {isLogin ? "Login Successful!" : "Activation Successful!"}
                </h2>
                <p className="text-gray-600 text-center mt-2 mb-8">
                  Redirecting you to the dashboard...
                </p>
                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 animate-pulse"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CodeVerification;
