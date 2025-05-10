
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
import { Loader, Mail, User, Check, ArrowRight, Key, Eye } from "lucide-react";
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
        if (data.session) {
          navigate('/resources');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (session) {
        navigate('/resources');
      }
    });
    
    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Handle OTP verification
  const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    setLoading(true);
    try {
      // Verify email OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: signUpForm.getValues('email'),
        token: values.otp,
        type: 'signup',
      });

      if (error) throw error;

      toast({
        title: "Verification successful",
        description: "Your account has been verified. Redirecting to resources...",
        variant: "success",
      });

      // If user ID was stored, create profile
      if (userId) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            { id: userId, name: signUpForm.getValues('name'), email: signUpForm.getValues('email') }
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    
    try {
      // Email signup flow
      const { data, error } = await supabase.auth.signUp({ 
        email: values.email, 
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
          emailRedirectTo: window.location.origin + '/resources'
        }
      });

      if (error) throw error;

      if (data.user) {
        setUserId(data.user.id);
        setVerificationSent(true);
        setShowOtpForm(true);
        
        toast({
          title: "Verification email sent!",
          description: "Please check your email for the verification code.",
          variant: "success",
        });
      }
    } catch (error: any) {
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
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
        variant: "success",
      });
      
      // Navigate after successful sign in
      navigate('/resources');
    } catch (error: any) {
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
      </div>

      {/* Glass card effect with enhanced animations */}
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0 animate-fade-in hover:shadow-2xl transition-all duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text animate-fade-in-up">ChemFlow Learning</CardTitle>
          <CardDescription className="text-gray-600 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Access all learning resources by creating an account
          </CardDescription>
        </CardHeader>
        
        {showOtpForm ? (
          <CardContent className="space-y-4 animate-fade-in-up">
            <div className="text-center mb-4">
              <Badge variant="outline" className="mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse-subtle">Verification Required</Badge>
              <h3 className="text-lg font-medium">Enter the verification code</h3>
              <p className="text-sm text-gray-500">We've sent a 6-digit code to your email</p>
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
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1" 
                  disabled={loading}
                >
                  {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Verify Code
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
