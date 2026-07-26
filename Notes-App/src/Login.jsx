export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop antialiased font-body-md">
      <main className="w-full max-w-[420px] surface-white p-xl rounded-md shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col gap-lg">
        <header className="flex flex-col items-center text-center gap-sm mb-md">
          <div className="h-12 w-12 bg-primary-container rounded flex items-center justify-center text-on-primary mb-sm">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary md:font-headline-lg md:text-headline-lg font-headline-lg-mobile text-headline-lg-mobile">Welcome back</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your Editorial Workspace</p>
        </header>
        
        <form className="flex flex-col gap-md" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-background" htmlFor="email">Email address</label>
            <input className="editorial-input font-body-md text-body-md text-on-background w-full" id="email" name="email" placeholder="name@company.com" required type="email"/>
          </div>
          
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md text-on-background" htmlFor="password">Password</label>
            </div>
            <input className="editorial-input font-body-md text-body-md text-on-background w-full" id="password" name="password" placeholder="••••••••" required type="password"/>
          </div>
          
          <div className="flex flex-col gap-md mt-sm">
            <button className="btn-primary font-label-md text-label-md w-full font-semibold flex justify-center items-center gap-sm" type="submit">
              Sign In
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button className="btn-secondary font-label-md text-label-md w-full font-medium" type="button">
              Create account
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
