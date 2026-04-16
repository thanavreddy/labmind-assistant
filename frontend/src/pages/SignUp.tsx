import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Role = 'student' | 'faculty';

export default function Signup() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const { error } = await signUpWithEmail(
      email,
      password,
      fullName,
      role
    );

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    // Redirect after successful signup
    navigate('/dashboard');
  };

  const handleGoogleSignup = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Join LabMind</h1>
          <p className="text-muted-foreground text-sm">
            Create your CBIT account
          </p>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              role === 'student'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="text-2xl mb-1">🎓</div>
            <div className="font-medium text-sm">Student</div>
            <div className="text-xs text-muted-foreground">
              Complete lab experiments
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('faculty')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              role === 'faculty'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="text-2xl mb-1">👩‍🏫</div>
            <div className="font-medium text-sm">Faculty</div>
            <div className="text-xs text-muted-foreground">
              Manage and review students
            </div>
          </button>
        </div>

        {/* Google Signup */}
        <Button
          variant="outline"
          className="w-full flex items-center gap-3"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          Continue with Google (@cbit.org.in)
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Thanav Reddy"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">CBIT Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ugsXXXXX_cse.name@cbit.org.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Creating account...'
              : `Sign Up as ${role === 'student' ? 'Student' : 'Faculty'}`}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}