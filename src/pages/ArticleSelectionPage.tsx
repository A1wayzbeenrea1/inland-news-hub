
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleSelection } from '@/components/news/ArticleSelection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart2, Settings } from 'lucide-react';

const ArticleSelectionPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-news-dark font-serif mb-2">
            Content Management
          </h1>
          <p className="text-gray-600">
            Select articles for publication based on SEO score and interaction rates
          </p>
        </div>
        
        <Tabs defaultValue="metrics">
          <TabsList className="mb-6">
            <TabsTrigger value="metrics" className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span>Performance Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <ArticleSelection />
          </TabsContent>
          
          <TabsContent value="content">
            <div className="bg-white p-6 rounded-lg shadow text-center py-12">
              <h2 className="text-xl font-medium mb-2">Content Management Coming Soon</h2>
              <p className="text-gray-500">
                This tab will contain full content editing capabilities in a future update.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow text-center py-12">
              <h2 className="text-xl font-medium mb-2">Settings Panel Coming Soon</h2>
              <p className="text-gray-500">
                Advanced configuration options will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleSelectionPage;
