export function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
    </div>
  );
}

