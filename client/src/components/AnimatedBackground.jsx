export default function AnimatedBackground({ variant = 'light' }) {
  const safeVariant = ['light', 'dark'].includes(variant) ? variant : 'light';

  if (safeVariant === 'light') {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[15%] w-8 h-8 border-2 border-eggshell/30 rounded-md animate-float-1"></div>
        <div className="absolute top-[20%] left-[25%] w-4 h-4 bg-surface/20 rounded-full animate-float-2"></div>
        
        <div className="absolute top-[25%] right-[20%] w-12 h-12 border border-eggshell/20 rounded-lg animate-float-3"></div>
        <div className="absolute top-[15%] right-[10%] w-6 h-6 bg-surface/10 rotate-45 animate-float-1"></div>
        
        <div className="absolute bottom-[20%] left-[20%] w-10 h-10 bg-eggshell/10 rounded-full animate-float-2"></div>
        <div className="absolute bottom-[30%] left-[10%] w-5 h-5 border-2 border-surface/30 rotate-12 animate-float-3"></div>
        
        <div className="absolute bottom-[15%] right-[15%] w-8 h-8 bg-eggshell/20 rounded animate-float-1"></div>
        <div className="absolute bottom-[25%] right-[25%] w-6 h-6 border-2 border-surface/20 rounded-full animate-float-2"></div>

        <div className="absolute top-[50%] left-[50%] w-4 h-4 bg-eggshell/20 rounded-sm rotate-45 animate-float-3"></div>

        <div className="absolute top-[5%] left-[50%] w-3 h-3 bg-surface/10 rounded-full animate-float-1"></div>
        <div className="absolute top-[80%] left-[80%] w-6 h-6 border border-eggshell/20 rotate-45 animate-float-3"></div>
        <div className="absolute top-[40%] left-[80%] w-4 h-4 bg-surface/15 rounded-sm animate-float-2"></div>
        <div className="absolute bottom-[5%] left-[50%] w-3 h-3 border-2 border-eggshell/10 rounded-full animate-float-1"></div>
        <div className="absolute top-[10%] right-[30%] w-5 h-5 bg-surface/10 rounded-full animate-float-3"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block">
      <div className="absolute top-[10%] left-[10%] w-10 h-10 border-2 border-primary/20 rounded-lg animate-float-2"></div>
      <div className="absolute top-[15%] left-[20%] w-5 h-5 bg-sidebar/10 rounded-full animate-float-1"></div>
      
      <div className="absolute top-[20%] right-[15%] w-8 h-8 border border-deep-space-blue/10 rounded-md rotate-12 animate-float-3"></div>
      <div className="absolute top-[30%] right-[10%] w-4 h-4 bg-primary/15 rotate-45 animate-float-2"></div>
      
      <div className="absolute bottom-[25%] left-[15%] w-6 h-6 bg-blue-slate/10 rounded-full animate-float-1"></div>
      <div className="absolute bottom-[15%] left-[25%] w-12 h-12 border-2 border-sidebar/15 rotate-45 animate-float-3"></div>
      
      <div className="absolute bottom-[20%] right-[20%] w-8 h-8 bg-primary/10 rounded animate-float-2"></div>
      <div className="absolute bottom-[10%] right-[10%] w-5 h-5 border-2 border-deep-space-blue/20 rounded-full animate-float-1"></div>

      <div className="absolute top-[60%] left-[40%] w-6 h-6 bg-sidebar/5 rounded-sm rotate-12 animate-float-3"></div>

      <div className="absolute top-[5%] left-[50%] w-3 h-3 bg-blue-slate/10 rounded-full animate-float-1"></div>
      <div className="absolute top-[80%] left-[80%] w-6 h-6 border border-primary/20 rotate-45 animate-float-3"></div>
      <div className="absolute top-[40%] left-[80%] w-4 h-4 bg-deep-space-blue/15 rounded-sm animate-float-2"></div>
      <div className="absolute bottom-[5%] left-[50%] w-3 h-3 border-2 border-sidebar/10 rounded-full animate-float-1"></div>
      <div className="absolute top-[10%] right-[30%] w-5 h-5 bg-primary/10 rounded-full animate-float-3"></div>
    </div>
  );
}
