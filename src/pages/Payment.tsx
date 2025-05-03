
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import { ArrowRight, Check, CreditCard } from "lucide-react";
import { toast } from "sonner";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Store payment completion in localStorage
      localStorage.setItem('chemflow-payment-completed', 'true');
      
      // Show success toast
      toast.success("Payment completed successfully!");
      
      // Redirect to dashboard
      navigate("/dashboard");
    }, 2000);
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
              
              <form onSubmit={handlePaymentSubmit}>
                {/* Card information */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Information
                  </label>
                  <div className="border rounded-md overflow-hidden">
                    <div className="flex border-b p-3">
                      <input 
                        type="text" 
                        placeholder="Card number" 
                        className="flex-1 outline-none"
                        required
                      />
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="flex-1 p-3 outline-none border-r"
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        className="flex-1 p-3 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Cardholder name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Name as it appears on card" 
                    className="w-full p-3 border rounded-md outline-none"
                    required
                  />
                </div>
                
                {/* Email */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="For payment receipt" 
                    className="w-full p-3 border rounded-md outline-none"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 rounded-md"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Pay ₹500 <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </Button>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Your payment is secure and encrypted
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
