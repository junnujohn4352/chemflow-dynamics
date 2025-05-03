
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { ArrowRight, Check, CreditCard, Info } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentStep, setPaymentStep] = useState<"qr" | "verification">("qr");
  
  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      toast.error("Please enter a valid UTR/Transaction ID");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment verification
    setTimeout(() => {
      // Store payment completion in localStorage
      localStorage.setItem('chemflow-payment-completed', 'true');
      localStorage.setItem('chemflow-transaction-id', transactionId);
      
      // Show success toast
      toast.success("Payment verified successfully!");
      
      // Redirect to dashboard
      navigate("/dashboard");
    }, 2000);
  };
  
  const handleQrCodeScanned = () => {
    setPaymentStep("verification");
    toast.info("Please verify your payment by entering the UTR/Transaction ID");
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
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Left column: Product details */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8">
              <h2 className="text-2xl font-bold mb-6">ChemFlow Complete</h2>
              <p className="text-blue-100 mb-6">Get full access to all features and tools</p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Process Simulation",
                  "Chemical Formulas Library",
                  "Equipment Sizing",
                  "HYSYS Calculations",
                  "Unlimited Projects",
                  "No Recurring Fees"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-blue-200" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-blue-400 pt-6">
                <div className="text-sm text-blue-200">One-time payment</div>
                <div className="text-4xl font-bold">₹500</div>
                <div className="text-sm text-blue-200">Lifetime access</div>
              </div>
            </div>
            
            {/* Right column: Payment form */}
            <div className="md:col-span-3 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {paymentStep === "qr" ? "Scan QR Code to Pay" : "Verify Your Payment"}
              </h2>
              
              {paymentStep === "qr" ? (
                <div className="flex flex-col items-center">
                  <Card className="w-full max-w-md mx-auto mb-6 bg-gray-100 p-2">
                    <CardContent className="flex justify-center p-4">
                      <img 
                        src="/lovable-uploads/560d7ef8-96d2-4f88-86fe-57e973bfbbbc.png" 
                        alt="Payment QR Code" 
                        className="w-64 h-64 object-contain"
                      />
                    </CardContent>
                  </Card>
                  
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">Scan the QR code with your payment app</p>
                    <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                      <Info className="h-4 w-4 mr-1" />
                      <span>Make sure to save your transaction ID</span>
                    </div>
                    <p className="font-semibold">Amount: ₹500</p>
                  </div>
                  
                  <Button
                    onClick={handleQrCodeScanned}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 rounded-md"
                  >
                    I've Made the Payment
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleVerifyPayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id" className="text-gray-700">
                      UTR/Transaction ID
                    </Label>
                    <Input
                      id="transaction-id"
                      type="text"
                      placeholder="Enter your payment reference number"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full p-3"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Enter the UTR or transaction ID you received after making the payment
                    </p>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 rounded-md"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Verify Payment <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Your payment information is secure and encrypted
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
