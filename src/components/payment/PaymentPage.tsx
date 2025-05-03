
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import GlassPanel from "@/components/ui/GlassPanel";
import { useToast } from "@/hooks/use-toast";
import { Check, Lock, CreditCard, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PaymentPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if payment was already completed
  useEffect(() => {
    if (user?.isSubscribed) {
      setIsPaid(true);
      if (user.transactionId) {
        setTransactionId(user.transactionId);
      }
    }
  }, [user]);

  // If not authenticated, redirect to sign-in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  const validateTransactionId = () => {
    if (!transactionId.trim()) {
      setTransactionIdError("Transaction ID/UTR Number is required");
      return false;
    }
    setTransactionIdError("");
    return true;
  };

  const handlePaymentSuccess = async () => {
    if (!validateTransactionId()) return;

    setIsProcessing(true);
    try {
      // Update user profile in Supabase
      await updateProfile({
        isSubscribed: true,
        transactionId: transactionId
      });
      
      setIsPaid(true);
      
      toast({
        title: "Payment successful!",
        description: "Your account has been successfully activated for simulations.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Payment verification failed",
        description: "There was an error verifying your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    navigate("/create-simulation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-16 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">
            ChemFlow Simulation Access
          </h1>
          <p className="text-lg text-blue-700 dark:text-blue-300">
            One-time payment for full simulation capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <GlassPanel className="p-6 bg-white/90 dark:bg-gray-800/50">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-white">
                  Benefits of ChemFlow Simulation
                </h2>
                <ul className="space-y-3">
                  {[
                    "Complete process simulation capabilities",
                    "Advanced thermodynamic models",
                    "Graphical results and analysis",
                    "Full range of chemical components",
                    "Equipment sizing and rating",
                    "Energy optimization tools",
                    "Export and share simulation reports"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
                <div className="flex items-center mb-2">
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Secure Payment
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your payment information is securely processed. We don't store any payment details.
                </p>
              </div>
            </GlassPanel>
          </div>
          
          <div>
            <GlassPanel className="p-6 bg-white/90 dark:bg-gray-800/50">
              {!isPaid ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-blue-900 dark:text-white">
                      Simulation Access
                    </h2>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-blue-900 dark:text-white">₹500</span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400">one-time payment</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Pay just ₹500 for immediate access to all simulation features
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Scan & Pay Using PhonePe App
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scan the QR code below to pay ₹500 and complete your payment
                        </p>
                      </div>
                      <div className="p-4 flex justify-center bg-white dark:bg-gray-900">
                        <img 
                          src="/lovable-uploads/05c023b7-7456-4916-b341-0146f9129cd3.png" 
                          alt="PhonePe QR Code" 
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="transactionId" className="mb-2 block">
                      Transaction ID/UTR Number
                    </Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter your payment Transaction ID or UTR Number"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className={transactionIdError ? "border-red-500" : ""}
                    />
                    {transactionIdError && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {transactionIdError}
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This ID is provided by your bank or payment app after successful payment
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handlePaymentSuccess} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Confirm ₹500 Payment
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                    Payment Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your payment of ₹500 was successful. You now have full access to all simulation features in ChemFlow.
                  </p>
                  <Button 
                    onClick={handleContinue} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Continue to Simulations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
