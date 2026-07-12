export default function AppLoading() {
  return (
    <div className="min-h-[40vh] px-6 py-16">
      <div className="mx-auto flex max-w-7xl items-center gap-3 text-forest-700">
        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-forest-300 border-t-forest-700" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}
