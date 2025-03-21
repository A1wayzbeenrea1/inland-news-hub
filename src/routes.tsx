
import { Route, Routes } from "react-router-dom";
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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/contact/send-tips" element={<SendUsTips />} />
      <Route path="/article/:slug" element={<Article />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/category/health" element={<HealthCategoryPage />} />
      <Route path="/category/environment" element={<EnvironmentCategoryPage />} />
      <Route path="/category/most-recent" element={<MostRecentCategoryPage />} />
      <Route path="/community/:community" element={<CommunityPage />} />
      <Route path="/communities/:community" element={<CommunityPage />} />
      <Route path="/communities" element={<CommunityPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/article-selection" element={<ArticleSelectionPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
