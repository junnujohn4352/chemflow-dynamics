
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassPanel from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChemFlowLogo } from "@/assets/icons/ChemFlowLogo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: SignInFormValues) => {
    setAuthError(null); // Reset any previous errors
    try {
      const result = await login(values.email, values.password);
      if (result?.error) {
        // Format the error message in a user-friendly way
        if (result.error.message.includes("Email not confirmed")) {
          setAuthError("Please confirm your email address before signing in. Check your inbox for a confirmation email.");
        } else {
          setAuthError(result.error.message || "An error occurred during sign in");
        }
      }
    } catch (error: any) {
      setAuthError(error?.message || "An unexpected error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      const result = await loginWithGoogle();
      if (result?.error) {
        setAuthError(result.error.message || "An error occurred during Google sign in");
      }
      // No need to navigate here as loginWithGoogle will redirect to Google auth page
    } catch (error: any) {
      setAuthError(error?.message || "An unexpected error occurred");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <ChemFlowLogo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Sign in to your account</p>
        </div>
        
        <GlassPanel className="p-6">
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-flow-blue hover:text-flow-blue/90"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2">
                    <FormControl>
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="focus:ring-flow-blue h-4 w-4 text-flow-blue border-gray-300 rounded"
                          checked={field.value}
                          onChange={field.onChange}
                          id="rememberMe"
                        />
                      </div>
                    </FormControl>
                    <div className="text-sm">
                      <FormLabel htmlFor="rememberMe" className="font-medium text-gray-700 dark:text-gray-300">
                        Remember me for 30 days
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-flow-blue hover:bg-flow-blue/90" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                )}
                Sign in with Google
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-flow-blue hover:text-flow-blue/90 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default SignIn;
