
import { useAppSelector } from "@/store/hooks";

export function Header() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-20 border-b border-forest-900/10 bg-[#f7f4ed]/90 px-4 py-4 backdrop-blur sm-6 lg-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-700">Admin</p>
          <h1 className="text-xl font-semibold text-forest-900">Control Center</h1>
        </div>
        <div className="min-w-0 text-right">
          {/* @ts-ignore: user may be undefined in plain JS */}
          <p className="truncate text-sm font-semibold text-forest-900">{(user || {}).name}</p>
          {/* @ts-ignore: user may be undefined in plain JS */}
          <p className="text-xs text-forest-900/60">{(user || {}).role}</p>
        </div>
      </div>
    </header>
  );
}
