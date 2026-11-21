import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminLayout } from './AdminLayout';
import { CategoriesPage } from './CategoriesPage';
import { ChangePasswordPage } from './ChangePasswordPage';
import { DashboardPage } from './DashboardPage';
import { GalleryPage } from './GalleryPage';
import { LoginPage } from './LoginPage';
import { ProductsPage } from './ProductsPage';
import { ReviewsPage } from './ReviewsPage';
import { SettingsPage } from './SettingsPage';

function AdminRoutes() {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-onyx">
        <p className="animate-pulse text-[11px] uppercase tracking-[0.24em] text-ash">Checking session…</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  if (admin.mustChangePassword) {
    return (
      <Routes>
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="change-password" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="services" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-onyx">
        <AdminRoutes />
      </div>
    </AdminAuthProvider>
  );
}
