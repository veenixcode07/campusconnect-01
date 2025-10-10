import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { loginSchema } from '@/lib/validation';

export const LoginForm: React.FC = () => {
  const [sapid, setSapid] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate input
      const validatedData = loginSchema.parse({ sapid, password });
      
      // Get email by SAP ID
      const { data: email, error: lookupError } = await supabase
        .rpc('get_email_by_sapid', { input_sapid: validatedData.sapid });
      
      if (lookupError || !email) {
        throw new Error('Invalid SAP ID or password');
      }
      
      await login(email, validatedData.password);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid input",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid SAP ID or password",
          variant: "destructive"
        });
      }
      setSapid('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Campus Connect</CardTitle>
          <CardDescription className="text-base">
            Sign in with your SAP ID to access your portal
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sapid" className="text-sm font-medium">SAP ID</Label>
              <Input
                id="sapid"
                type="text"
                placeholder="Enter your SAP ID"
                value={sapid}
                onChange={(e) => setSapid(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
