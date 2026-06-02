export function LoadingBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] overflow-hidden">
      <div className="loading-bar-slide h-full w-1/3 bg-accent/70" />
    </div>
  );
}