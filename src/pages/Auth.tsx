
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
import { Loader, Mail, Phone, User, Check, ArrowRight, Key, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define schemas for form validation
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
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
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
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
      phone: "",
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
      if (verificationMethod === 'email') {
        // Verify email OTP
        const { data, error } = await supabase.auth.verifyOtp({
          email: signUpForm.getValues('email'),
          token: values.otp,
          type: 'signup',
        });

        if (error) throw error;

        toast({
          title: "Verification successful",
          description: "Your account has been verified",
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
      } else {
        // Verify phone OTP (if implemented)
        // This would require additional Supabase configuration for phone auth
        toast({
          title: "Phone verification",
          description: "Phone verification currently requires additional configuration",
          variant: "default",
        });
      }
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

  // Sign up with email and password
  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    
    try {
      if (verificationMethod === 'email') {
        // Email signup flow
        const { data, error } = await supabase.auth.signUp({ 
          email: values.email, 
          password: values.password,
          options: {
            data: {
              name: values.name,
            }
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
      } else {
        // Phone signup flow (would require additional Supabase configuration)
        toast({
          title: "Phone signup",
          description: "Phone signup requires additional Supabase configuration",
          variant: "default",
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

  // Toggle between email and phone verification methods
  const toggleVerificationMethod = () => {
    setVerificationMethod(prev => prev === 'email' ? 'phone' : 'email');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 overflow-hidden relative">
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute left-1/3 bottom-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "4s" }}></div>
        <div className="absolute right-1/3 top-1/3 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Glass card effect */}
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0 animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">ChemFlow Learning</CardTitle>
          <CardDescription className="text-gray-600">
            Access all learning resources by creating an account
          </CardDescription>
        </CardHeader>
        
        {showOtpForm ? (
          <CardContent className="space-y-4 animate-fade-in-up">
            <div className="text-center mb-4">
              <Badge variant="success" className="mb-2">Verification Required</Badge>
              <h3 className="text-lg font-medium">Enter the verification code</h3>
              <p className="text-sm text-gray-500">We've sent a 6-digit code to your {verificationMethod}</p>
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
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                  disabled={loading}
                >
                  {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Verify Code
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setShowOtpForm(false)} 
                    className="text-sm"
                  >
                    Go back to sign in
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        ) : (
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="animate-fade-in-up">
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
                                className="pl-10" 
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
                                className="pl-10" 
                                {...field} 
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-10 w-10"
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
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                      disabled={loading}
                    >
                      {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                      Sign In
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="animate-fade-in-up">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Verification via:</h3>
                      <div className="flex items-center space-x-2">
                        <Button 
                          type="button" 
                          variant={verificationMethod === 'email' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setVerificationMethod('email')}
                          className={verificationMethod === 'email' ? 'bg-blue-500' : ''}
                        >
                          <Mail className="mr-1 h-3 w-3" />
                          Email
                        </Button>
                        <Button 
                          type="button" 
                          variant={verificationMethod === 'phone' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setVerificationMethod('phone')}
                          className={verificationMethod === 'phone' ? 'bg-blue-500' : ''}
                        >
                          <Phone className="mr-1 h-3 w-3" />
                          Phone
                        </Button>
                      </div>
                    </div>
                    
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
                                className="pl-10" 
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
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {verificationMethod === 'phone' && (
                      <FormField
                        control={signUpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="+1 (555) 123-4567" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
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
                                className="pl-10" 
                                {...field} 
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-0 top-0 h-10 w-10"
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
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
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
