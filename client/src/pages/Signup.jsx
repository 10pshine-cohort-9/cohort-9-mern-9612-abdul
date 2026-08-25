import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.setCustomValidity(
        password === confirmPassword ? '' : 'Passwords do not match'
      );
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;

    setError('');
    setIsLoading(true);

    const form = e.currentTarget;
    const name = form.fullName.value.trim();
    const email = form.email.value.trim();

    try {
      await registerUser({ name, email, password });


      const { token, user } = await loginUser({ email, password });
      login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex antialiased font-body-md bg-background">

      <div className="hidden lg:flex lg:w-1/2 lg:shrink-0 bg-sidebar flex-col items-center justify-center p-12 relative border-r border-sidebar-border/30">
        <div className="flex flex-col items-center text-center w-full">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-editorial bg-primary flex items-center justify-center text-on-primary font-bold text-2xl shadow-subtle">
              S
            </div>
            <span className="font-headline-lg text-3xl font-bold tracking-tight text-sidebar-text">
              SHINE Notes
            </span>
          </div>
          
          <h2 className="font-headline-lg text-5xl font-bold leading-tight text-sidebar-text mb-6">
            Start your creative journey.
          </h2>
          
          <p className="font-body-md text-sidebar-muted text-lg">
            Join thousands of writers, editors, and creators who use SHINE to bring their best ideas to life.
          </p>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto relative z-10 bg-background">
        <main className="w-full max-w-[400px] flex flex-col py-8">
          <header className="flex flex-col mb-10">
            <h1 className="font-headline-lg text-4xl font-bold text-on-surface tracking-tight mb-2">Create an account</h1>
            <p className="font-body-md text-xl font-semibold text-on-surface-variant">Start your writing journey today.</p>
          </header>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/30 rounded-editorial text-danger font-label-sm" role="alert">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <p>{error}</p>
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface" htmlFor="fullName">Full Name</label>
              <input
                className="w-full px-4 py-3 bg-surface border border-outline rounded-editorial font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                id="fullName"
                name="fullName"
                placeholder="Jane Doe"
                required
                type="text"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface" htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-3 bg-surface border border-outline rounded-editorial font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                id="email"
                name="email"
                placeholder="jane@example.com"
                required
                type="email"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pr-10 bg-surface border border-outline rounded-editorial font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              <p className="font-label-sm text-on-surface-variant mt-1 text-xs">Must be at least 8 characters.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface" htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="w-full px-4 py-3 bg-surface border border-outline rounded-editorial font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                ref={confirmPasswordRef}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <button
                className="w-full bg-primary text-on-primary py-3 px-6 rounded-editorial font-label-md hover:bg-primary-hover active:scale-[0.99] transition-all shadow-subtle flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
              <button
                className="w-full bg-surface text-on-surface py-3 px-6 rounded-editorial border border-outline hover:bg-background active:scale-[0.99] transition-all font-label-md"
                type="button"
                onClick={() => navigate('/login')}
                disabled={isLoading}
              >
                Sign in instead
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
