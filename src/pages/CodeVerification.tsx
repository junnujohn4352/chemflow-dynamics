
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { KeySquare, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

const CodeVerification: React.FC = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [storedCode, setStoredCode] = useState<string | null>(null);
  const [isActivated, setIsActivated] = useState(false);
  
  useEffect(() => {
    // Check if already logged in
    const activated = localStorage.getItem('chemflow-activated');
    if (activated === 'true') {
      navigate('/dashboard');
      return;
    }
    
    // Get the stored activation code
    const code = localStorage.getItem('chemflow-activation-code');
    setStoredCode(code);
    
    // Check if payment is completed
    const paymentCompleted = localStorage.getItem('chemflow-payment-completed');
    if (paymentCompleted !== 'true') {
      // Redirect to payment page if payment is not completed
      navigate('/payment');
    }
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
      if (activationCode === storedCode) {
        // Set activation status in localStorage
        localStorage.setItem('chemflow-activated', 'true');
        
        setIsActivated(true);
        toast.success("Application successfully activated!");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error("Invalid activation code. Please try again.");
        setIsVerifying(false);
      }
    }, 1500);
  };
  
  const formatCodeSegment = (code: string, index: number): string => {
    if (!code) return "";
    const segments = code.split('-');
    return segments[index] || "";
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
                  <h2 className="text-2xl font-bold text-gray-800 text-center">Activate ChemFlow</h2>
                  <p className="text-gray-600 text-center mt-2">
                    Enter your activation code to get started
                  </p>
                </div>
                
                <form onSubmit={handleActivation} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="activation-code" className="text-gray-700">
                      Activation Code
                    </Label>
                    
                    <div className="flex justify-center mb-6">
                      <InputOTP maxLength={19} value={activationCode} onChange={setActivationCode}>
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
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={8} />
                          <InputOTPSlot index={9} />
                          <InputOTPSlot index={10} />
                          <InputOTPSlot index={11} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={12} />
                          <InputOTPSlot index={13} />
                          <InputOTPSlot index={14} />
                          <InputOTPSlot index={15} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    
                    <p className="text-sm text-gray-500 text-center mt-2">
                      The code was generated after your payment was verified
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
                        Verifying...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Activate Software <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Lost your code? <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/payment')}>Return to payment page</Button>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">Activation Successful!</h2>
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
