
import { Route, Routes, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Article from "@/pages/Article";
import About from "@/pages/About";
import Staff from "@/pages/Staff";
import NotFound from "@/pages/NotFound";
import SendUsTips from "@/pages/SendUsTips";
import CategoryPage from "@/pages/CategoryPage";
import HealthCategoryPage from "@/pages/HealthCategoryPage";
import EnvironmentCategoryPage from "@/pages/EnvironmentCategoryPage";
import CommunityPage from "@/pages/CommunityPage";
import Accessibility from "@/pages/Accessibility";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import ArticleSelectionPage from "@/pages/ArticleSelectionPage";
import MostRecentCategoryPage from "@/pages/MostRecentCategoryPage";

// Simple auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/accessibility" element={<Accessibility />} />
      
      {/* Contact routes */}
      <Route path="/contact/send-tips" element={<SendUsTips />} />
      <Route path="/send-us-tips" element={<SendUsTips />} />
      
      {/* Article routes */}
      <Route path="/article/:slug" element={<Article />} />
      <Route path="/article-selection" element={<ArticleSelectionPage />} />
      
      {/* Category routes */}
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/category/health" element={<HealthCategoryPage />} />
      <Route path="/category/environment" element={<EnvironmentCategoryPage />} />
      <Route path="/category/most-recent" element={<MostRecentCategoryPage />} />
      
      {/* Community routes - support both singular and plural paths */}
      <Route path="/community/:community" element={<CommunityPage />} />
      <Route path="/communities/:community" element={<CommunityPage />} />
      <Route path="/communities" element={<CommunityPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/article-selection" element={
        <ProtectedRoute>
          <ArticleSelectionPage />
        </ProtectedRoute>
      } />
      
      {/* Catch-all for 404 errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
