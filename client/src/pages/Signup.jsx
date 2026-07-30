import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop antialiased font-body-md">
      <main className="w-full max-w-[440px] bg-surface rounded-xl border border-outline-variant p-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05),_0px_4px_12px_rgba(0,0,0,0.05)]">
        <header className="text-center mb-xl">
          <div className="h-12 w-12 bg-primary-container rounded flex items-center justify-center text-on-primary mb-sm mx-auto">
            <span aria-hidden="true" className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-xs">Start writing</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Join our community of professionals.</p>
        </header>

        <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-sm">
            <label className="block font-label-md text-label-md text-on-background" htmlFor="fullName">Full Name</label>
            <input
              className="w-full px-[16px] py-[12px] bg-surface border border-outline-variant rounded-[12px] font-body-md text-body-md text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
              id="fullName" name="fullName" placeholder="Jane Doe" required type="text"
            />
          </div>
          <div className="space-y-sm">
            <label className="block font-label-md text-label-md text-on-background" htmlFor="email">Email</label>
            <input
              className="w-full px-[16px] py-[12px] bg-surface border border-outline-variant rounded-[12px] font-body-md text-body-md text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
              id="email" name="email" placeholder="jane@example.com" required type="email"
            />
          </div>

          <div className="space-y-sm">
            <label className="block font-label-md text-label-md text-on-background" htmlFor="password">Password</label>
            <div className="relative">
              <input
                className="w-full px-[16px] py-[12px] pr-10 bg-surface border border-outline-variant rounded-[12px] font-body-md text-body-md text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
                id="password" name="password" placeholder="••••••••" required minLength={8}
                type={showPassword ? 'text' : 'password'}
              />
              <button
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-on-background transition-colors"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Must be at least 8 characters.</p>
          </div>
          <div className="space-y-sm">
            <label className="block font-label-md text-label-md text-on-background" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="w-full px-[16px] py-[12px] bg-surface border border-outline-variant rounded-[12px] font-body-md text-body-md text-on-background placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
              id="confirmPassword" name="confirmPassword" placeholder="••••••••" required type="password"
            />
          </div>
          <div className="pt-sm space-y-md">
            <button
              className="w-full bg-primary-container text-on-primary py-[12px] px-lg rounded-[12px] font-label-md text-label-md hover:opacity-90 active:opacity-100 transition-opacity"
              type="submit"
            >
              Create Account
            </button>
            <div className="text-center">
              <Link
                className="inline-block font-label-md text-label-md text-outline hover:text-on-background transition-colors"
                to="/login"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
