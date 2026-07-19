
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ProtectedRoute } from "./ProtectedRoute";

export function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f4ed] text-[#172018]">
        <Sidebar />
        <div className="min-h-screen lg-72">
          <Header />
          <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm-6 lg-8 lg-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
