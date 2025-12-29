import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          display_name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully!');
          navigate('/dashboard');
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-xl">topmate</span>
          </Link>
          
          {mode === 'signin' ? (
            <Button 
              variant="outline" 
              className="rounded-lg"
              onClick={() => setMode('signup')}
            >
              Create Account
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="rounded-lg"
              onClick={() => setMode('signin')}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {mode === 'signin' ? 'Sign in' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {mode === 'signin' 
                  ? 'Sign in to join Calls and manage bookings'
                  : 'Get started with your creator storefront'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-lg h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  mode === 'signin' ? 'Continue' : 'Create Account'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setMode('signup')}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setMode('signin')}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-accent/30 p-12">
        <div className="relative">
          <div className="w-64 h-64 rounded-full bg-primary/10 absolute -top-8 -right-8" />
          <div className="relative z-10">
            <svg viewBox="0 0 400 300" className="w-96 h-72">
              {/* Simple illustration */}
              <rect x="120" y="80" width="160" height="140" rx="8" fill="hsl(var(--foreground))" />
              <rect x="130" y="90" width="140" height="100" rx="4" fill="hsl(var(--background))" />
              <circle cx="200" cy="250" r="20" fill="hsl(var(--muted))" />
              <rect x="180" y="200" width="40" height="50" fill="hsl(var(--foreground))" />
              {/* Person */}
              <circle cx="300" cy="180" r="25" fill="hsl(var(--foreground))" />
              <rect x="275" y="210" width="50" height="70" rx="4" fill="hsl(var(--foreground))" />
              <rect x="270" y="230" width="20" height="40" rx="2" fill="hsl(var(--muted))" />
              <rect x="310" y="230" width="20" height="40" rx="2" fill="hsl(var(--muted))" />
              {/* Chair */}
              <rect x="265" y="270" width="70" height="10" rx="2" fill="hsl(var(--muted))" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
