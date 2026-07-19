import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Briefcase, LogOut, Mail, ShieldCheck, Users, MapPin } from "lucide-react";
import { logoutAdmin } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Define navigation items with explicit icon components.
// For simplicity, all items use the generic `Activity` icon.
// Adjust icons as needed for a richer UI.
const baseItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Activity },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/attractions", label: "Attractions", icon: MapPin },
  { href: "/admin/news", label: "News", icon: Mail },
  { href: "/admin/events", label: "Events", icon: Activity },
  { href: "/admin/impact", label: "Impact", icon: Activity },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/contact-submissions", label: "Contact Submissions", icon: Mail }
];
const superAdminItems = [
  { href: "/admin/admins", label: "Admins", icon: Users },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: LogOut }
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const items = user?.role === "SUPER_ADMIN" ? [...baseItems, ...superAdminItems] : baseItems;

  async function handleLogout() {
    await dispatch(logoutAdmin());
    navigate("/admin/login");
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-forest-900/10 bg-white/85 px-4 py-5 shadow-panel backdrop-blur lg">
        <div className="flex h-full flex-col">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700 text-white">
              <ShieldCheck size={21} />
            </span>
            <span>
              <span className="block text-base font-semibold">Nature View</span>
              <span className="block text-xs text-forest-900/60">Admin Console</span>
            </span>
          </Link>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-forest-700 text-white"
                      : "text-forest-900/75 hover-forest-50 hover-forest-900"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-forest-900/75 hover-forest-50 hover-forest-900"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 gap-1 rounded-lg border border-forest-900/10 bg-white/95 p-1 shadow-panel backdrop-blur lg">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex h-12 items-center justify-center rounded-md ${
                active ? "bg-forest-700 text-white" : "text-forest-900/72"
              }`}
            >
              <Icon size={19} />
            </Link>
          );
        })}
        <button type="button" aria-label="Logout" onClick={handleLogout} className="flex h-12 items-center justify-center rounded-md text-forest-900/72">
          <LogOut size={19} />
        </button>
      </nav>
    </>
  );
}
