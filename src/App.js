import { Routes, Route, Navigate } from "react-router-dom";
import PublicShell from "@/components/PublicShell";
import HomePage from "@/app/page";
import ProjectsPage from "@/pages/projects/page";
import ProjectDetailPage from "@/pages/projects/[slug]/page";
import AttractionsPage from "@/pages/attractions/page";
import AttractionDetailPage from "@/pages/attractions/[slug]/page";
import NewsPage from "@/pages/news/page";
import NewsDetailPage from "@/pages/news/[slug]/page";
import EventsPage from "@/pages/events/page";
import EventDetailPage from "@/pages/events/[slug]/page";
import ImpactPage from "@/pages/impact/page";
import TeamPage from "@/pages/team/page";
import ContactPage from "@/pages/contact/page";
import AdminLoginPage from "@/pages/admin/auth/login/page";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/panel/admin/dashboard/page";
// Static admin pages that have custom logic and cannot be replaced by the dynamic entity page
import AdminAdminsPage from "@/pages/admin/panel/admin/admins/page";
import AdminAuditLogsPage from "@/pages/admin/panel/admin/audit-logs/page";
import AdminContactSubmissionsPage from "@/pages/admin/panel/admin/contact-submissions/page";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
      <Route path="/projects" element={<PublicShell><ProjectsPage /></PublicShell>} />
      {/* Project detail route ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ use a dynamic slug parameter */}
      <Route path="/projects/:slug" element={<PublicShell><ProjectDetailPage /></PublicShell>} />
      <Route path="/attractions" element={<PublicShell><AttractionsPage /></PublicShell>} />
      {/* Attraction detail route with slug */}
      <Route path="/attractions/:slug" element={<PublicShell><AttractionDetailPage /></PublicShell>} />
      <Route path="/news" element={<PublicShell><NewsPage /></PublicShell>} />
      {/* News detail route with slug */}
      <Route path="/news/:slug" element={<PublicShell><NewsDetailPage /></PublicShell>} />
      <Route path="/events" element={<PublicShell><EventsPage /></PublicShell>} />
      {/* Event detail route with slug */}
      <Route path="/events/:slug" element={<PublicShell><EventDetailPage /></PublicShell>} />
      <Route path="/impact" element={<PublicShell><ImpactPage /></PublicShell>} />
      <Route path="/team" element={<PublicShell><TeamPage /></PublicShell>} />
      <Route path="/contact" element={<PublicShell><ContactPage /></PublicShell>} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        {/* Static admin pages with custom implementations */}
        <Route path="admins" element={<AdminAdminsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="contact-submissions" element={<AdminContactSubmissionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
