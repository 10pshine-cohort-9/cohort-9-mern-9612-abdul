import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const form = event.currentTarget;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;

    setIsLoading(true);
    try {
      const { token, user } = await loginUser({ email, password });

      if (!token || typeof token !== 'string') {
        throw new Error('Received invalid authentication token.');
      }
      if (!user || typeof user !== 'object') {
        throw new Error('Received invalid user data.');
      }

      login(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex antialiased font-body-md bg-background">

      <div className="hidden lg:flex lg:w-1/2 lg:shrink-0 bg-sidebar flex-col items-center justify-center p-12 relative overflow-hidden border-r border-sidebar-border/30">
        
        {/* Animated Little Elements */}
        <AnimatedBackground variant="light" />

        <div className="flex flex-col items-center text-center w-full relative z-10">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-editorial bg-primary flex items-center justify-center text-on-primary font-bold text-2xl shadow-subtle">
              S
            </div>
            <span className="font-headline-lg text-3xl font-bold tracking-tight text-sidebar-text">
              SHINE Notes
            </span>
          </div>

          <h2 className="font-headline-lg text-5xl font-bold leading-tight text-sidebar-text mb-6">
            Welcome back to your workspace.
          </h2>

          <p className="font-body-md text-sidebar-muted text-lg">
            Pick up right where you left off. Continue crafting your ideas with the ultimate editorial experience.
          </p>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 bg-background overflow-y-auto">
        {/* Animated Little Elements (Dark) */}
        <AnimatedBackground variant="dark" />

        <main className="w-full max-w-[400px] flex flex-col py-8 relative z-10">
          <header className="flex flex-col mb-10">
            <h1 className="font-headline-lg text-5xl font-bold text-on-surface tracking-tight mb-2">Welcome back</h1>
            <p className="font-body-md text-2xl font-semibold text-on-surface-variant">Sign in to your SHINE account</p>
          </header>

          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/30 rounded-editorial text-danger font-label-sm" role="alert">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <p>{error}</p>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-on-surface" htmlFor="email">Email address</label>
              <input
                className="px-4 py-3 bg-surface border border-outline rounded-editorial focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-body-md text-on-surface w-full placeholder:text-on-surface-variant/50"
                id="email"
                name="email"
                placeholder="name@company.com"
                required
                type="email"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-on-surface" htmlFor="password">Password</label>
                <a href="#" className="font-label-sm text-primary hover:text-primary-hover transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pr-10 bg-surface border border-outline rounded-editorial font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              <button
                className="w-full bg-surface text-on-surface py-3 px-6 rounded-editorial border border-outline hover:bg-background active:scale-[0.99] transition-all font-label-md"
                type="button"
                onClick={() => navigate('/signup')}
                disabled={isLoading}
              >
                Create an account
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
