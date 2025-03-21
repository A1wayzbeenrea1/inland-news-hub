
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link, Check, AlertCircle } from "lucide-react";
import { scrapeArticleFromUrl, convertToArticle } from "@/services/urlScraperService";
import { Article } from "@/data/mockData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AdminUrlImporterProps {
  onAddStory: (story: Article) => void;
}

export function AdminUrlImporter({ onAddStory }: AdminUrlImporterProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Article | null>(null);

  const handleImport = async () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a URL to import an article",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validate URL format
      const urlObj = new URL(url);
      
      // Scrape article content
      const scrapedArticle = await scrapeArticleFromUrl(url);
      
      if (!scrapedArticle) {
        throw new Error("Failed to extract article data");
      }
      
      // Convert to article format
      const article = convertToArticle(scrapedArticle);
      
      // Show preview
      setPreviewData(article);
      
      toast({
        title: "Article imported",
        description: "Preview ready. You can now add this article to your stories.",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import article from URL",
        variant: "destructive",
      });
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToStories = () => {
    if (previewData) {
      onAddStory(previewData);
      toast({
        title: "Story added",
        description: "The article has been added to your stories",
      });
      // Reset the form
      setUrl("");
      setPreviewData(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Import Story from URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleImport} disabled={isLoading || !url}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import"
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the URL of an article to import its content automatically
            </p>
          </div>

          {previewData && (
            <div className="space-y-4 mt-6 border rounded-md p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Article Preview</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">Details</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <Tabs defaultValue="general">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                      </TabsList>
                      <TabsContent value="general" className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <strong>Category:</strong>
                          <span className="col-span-2">{previewData.category}</span>
                          
                          <strong>Author:</strong>
                          <span className="col-span-2">{previewData.author}</span>
                          
                          <strong>Published:</strong>
                          <span className="col-span-2">
                            {new Date(previewData.publishedAt).toLocaleString()}
                          </span>
                          
                          <strong>Tags:</strong>
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {previewData.tags?.map(tag => (
                              <span key={tag} className="bg-muted px-2 py-1 rounded-sm text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="content">
                        <div className="max-h-[300px] overflow-y-auto text-sm">
                          <p>{previewData.content.substring(0, 500)}...</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-4">
                <div className="aspect-video w-1/3 rounded-md overflow-hidden bg-muted">
                  <img 
                    src={previewData.image} 
                    alt={previewData.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{previewData.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {previewData.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {previewData.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button onClick={handleAddToStories}>
                  <Check className="mr-2 h-4 w-4" />
                  Add to Stories
                </Button>
              </div>
            </div>
          )}
          
          <div className="rounded-md bg-muted p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>The URL importer will attempt to automatically extract article content, images, and metadata. The accuracy may vary depending on the website structure.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
