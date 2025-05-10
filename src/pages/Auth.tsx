
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Mail, User, Check, ArrowRight, Key, Eye, AlertCircle, Info, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define schemas for form validation
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "Please enter the 6-digit code" }),
});

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form handling
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Session check:", data);
        if (data.session) {
          navigate('/resources');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Resend cooldown timer
  useEffect(() => {
    let interval: number | undefined;
    if (resendCooldown > 0) {
      interval = window.setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Handle OTP verification
  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      console.log("Verifying OTP:", values.otp, "for email:", tempEmail);
      
      // Verify email OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: tempEmail,
        token: values.otp,
        type: 'signup',
      });

      if (error) throw error;

      console.log("OTP verification response:", data);

      toast({
        title: "Verification successful",
        description: "Your account has been verified. Redirecting to resources...",
        variant: "success",
      });

      // If user ID was stored, create profile
      if (userId) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              { id: userId, name: signUpForm.getValues('name'), email: tempEmail }
            ]);

          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        } catch (profileErr) {
          console.error("Error in profile creation:", profileErr);
        }
      }
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
      
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrorMessage(error.message || "Invalid verification code");
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      return;
    }
    
    if (!tempEmail) {
      toast({
        title: "Error",
        description: "Email address is missing",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setInfoMessage("Sending verification email...");
    
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: tempEmail,
      });

      if (error) throw error;

      setResendCooldown(60); // Set cooldown to 60 seconds
      setInfoMessage("A new verification code has been sent to your email. Please check your inbox and spam folder.");
      
      toast({
        title: "Verification email sent!",
        description: "Please check your email for the new verification code.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error resending verification:", error);
      setErrorMessage(error.message || "Something went wrong");
      setInfoMessage(null);
      
      toast({
        title: "Error sending verification",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Starting sign up process for:", values.email);
      // Store email for OTP verification
      setTempEmail(values.email);
      
      // Email signup flow
      const { data, error } = await supabase.auth.signUp({ 
        email: values.email, 
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
          emailRedirectTo: `${window.location.origin}/resources`
        }
      });

      console.log("Sign up response:", data, error);

      if (error) throw error;

      if (data.user) {
        setUserId(data.user.id);
        setVerificationSent(true);
        setShowOtpForm(true);
        setInfoMessage("A verification code has been sent to your email. Please check your inbox and spam folder.");
        
        toast({
          title: "Verification email sent!",
          description: "Please check your email for the verification code.",
          variant: "success",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      setErrorMessage(error.message || "Something went wrong");
      toast({
        title: "Error creating account",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Signing in with:", values.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log("Sign in response:", data, error);

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
        variant: "success",
      });
      
      // Navigate after successful sign in
      navigate('/resources');
    } catch (error: any) {
      console.error("Sign in error:", error);
      setErrorMessage(error.message || "Invalid credentials");
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 overflow-hidden relative">
      {/* Enhanced Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute left-1/3 bottom-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "4s" }}></div>
        <div className="absolute right-1/3 top-1/3 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "3s" }}></div>
        <div className="absolute left-1/2 bottom-1/3 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "5s" }}></div>
        <div className="absolute right-1/2 top-1/2 w-48 h-48 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "6s" }}></div>
        
        {/* 3D Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rounded-lg transform rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white/20 rounded-full transform animate-spin-slow" style={{ animationDuration: "15s" }}></div>
        <div className="absolute top-1/3 right-40 w-12 h-12 border-2 border-white/20 rounded-lg transform -rotate-12 animate-spin-slow" style={{ animationDuration: "25s", animationDirection: "reverse" }}></div>
        <div className="absolute bottom-40 left-1/3 w-20 h-20 border-2 border-white/20 rounded-xl transform rotate-45 animate-spin-slow" style={{ animationDuration: "30s" }}></div>
      </div>

      {/* Glass card effect with enhanced animations */}
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0 animate-fade-in hover:shadow-2xl transition-all duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text animate-fade-in-up">ChemFlow Learning</CardTitle>
          <CardDescription className="text-gray-600 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Access all learning resources by creating an account
          </CardDescription>
        </CardHeader>
        
        {errorMessage && (
          <div className="px-6 -mt-2 mb-2">
            <Alert variant="destructive" className="animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {infoMessage && (
          <div className="px-6 -mt-2 mb-2">
            <Alert variant="info" className="animate-fade-in bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>{infoMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {showOtpForm ? (
          <CardContent className="space-y-4 animate-fade-in-up">
            <div className="text-center mb-4">
              <Badge variant="outline" className="mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse-subtle">Verification Required</Badge>
              <h3 className="text-lg font-medium">Enter the verification code</h3>
              <p className="text-sm text-gray-500">We've sent a 6-digit code to your email at <span className="font-medium">{tempEmail}</span></p>
            </div>

            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="border-blue-300 focus:border-blue-500 transition-colors" />
                            <InputOTPSlot index={1} className="border-blue-300 focus:border-blue-500 transition-colors" />
                            <InputOTPSlot index={2} className="border-blue-300 focus:border-blue-500 transition-colors" />
                            <InputOTPSlot index={3} className="border-blue-300 focus:border-blue-500 transition-colors" />
                            <InputOTPSlot index={4} className="border-blue-300 focus:border-blue-500 transition-colors" />
                            <InputOTPSlot index={5} className="border-blue-300 focus:border-blue-500 transition-colors" />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        Please check your inbox and spam folder for the verification code.
                      </p>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1" 
                    disabled={loading}
                  >
                    {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Verify Code
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleResendOtp}
                    disabled={loading || resendCooldown > 0}
                    className="w-full border-blue-300 hover:bg-blue-50 text-blue-600 transition-all"
                  >
                    {resendCooldown > 0 ? (
                      <>
                        <span className="mr-2">{resendCooldown}s</span>
                        Wait to resend
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend verification code
                      </>
                    )}
                  </Button>
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      onClick={() => setShowOtpForm(false)} 
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Go back to sign in
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        ) : (
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 mb-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <TabsTrigger value="signin" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="your@email.com" 
                                className="pl-10 border-blue-300 focus:border-blue-500 transition-colors" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                className="pl-10 border-blue-300 focus:border-blue-500 transition-colors" 
                                {...field} 
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1" 
                      disabled={loading}
                    >
                      {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                      Sign In
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="John Doe" 
                                className="pl-10 border-purple-300 focus:border-purple-500 transition-colors" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="your@email.com" 
                                className="pl-10 border-purple-300 focus:border-purple-500 transition-colors" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Create Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                className="pl-10 border-purple-300 focus:border-purple-500 transition-colors" 
                                {...field} 
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Must be at least 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1" 
                      disabled={loading}
                    >
                      {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                      Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default Auth;
