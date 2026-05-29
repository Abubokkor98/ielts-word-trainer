export function ProfileErrorState() {
  return (
    <div role="alert" className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 w-full">
      <p className="text-sm font-medium text-destructive">
        Failed to load profile data. Please try again later.
      </p>
    </div>
  );
}
