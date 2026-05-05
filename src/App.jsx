import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';

// Public layout + pages
import PublicLayout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Clients from './pages/Clients';
import Contact from './pages/Contact';
import Assessment from './pages/Assessment';
import Careers from './pages/Careers';
import BlogList from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

// Admin
import ProtectedAdminLayout from './components/admin/ProtectedAdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminInvitePage from './pages/admin/AdminInvitePage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AssessmentsList from './pages/admin/AssessmentsList';
import AdminClientsPage from './pages/admin/AdminClientsPage';
import AdminCareersPage from './pages/admin/AdminCareersPage';
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminBlogEditorPage from './pages/admin/AdminBlogEditorPage';
import AdminBlogTemplatesPage from './pages/admin/AdminBlogTemplatesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            {/* Public — no auth dependency */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:slug" element={<Careers />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/admin/invite/:token" element={<AdminInvitePage />} />
            </Route>

            {/* Admin login — standalone, no layout */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin — gated */}
            <Route path="/admin" element={<ProtectedAdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="assessments" element={<AssessmentsList />} />
              <Route path="clients" element={<AdminClientsPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="blog/new" element={<AdminBlogEditorPage />} />
              <Route path="blog/:id/edit" element={<AdminBlogEditorPage />} />
              <Route path="blog/templates" element={<AdminBlogTemplatesPage />} />
              <Route path="careers" element={<AdminCareersPage />} />
              <Route path="submissions" element={<AdminSubmissionsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;