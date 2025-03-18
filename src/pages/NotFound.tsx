
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaTags } from "@/components/common/MetaTags";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <MetaTags 
        title="Page Not Found | Inland Empire News Hub"
        description="The page you are looking for does not exist or has been moved."
      />
      <Header />
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-6xl font-bold text-news-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Link 
            to="/" 
            className="bg-news-secondary hover:bg-news-primary text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
