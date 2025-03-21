
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink, RefreshCw, Check, AlertCircle } from "lucide-react";
import { fetchKtlaArticles, importKtlaArticle } from "@/services/ktlaScraperService";
import { Article } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KtlaArticleLink {
  title: string;
  url: string;
  publishedAt: string;
  previewImage?: string;
}

interface AdminKtlaImporterProps {
  onAddStories: (stories: Article[]) => void;
}

export function AdminKtlaImporter({ onAddStories }: AdminKtlaImporterProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [articles, setArticles] = useState<KtlaArticleLink[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [importedArticles, setImportedArticles] = useState<Article[]>([]);

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const ktlaArticles = await fetchKtlaArticles();
      setArticles(ktlaArticles);
      
      if (ktlaArticles.length === 0) {
        toast({
          title: "No articles found",
          description: "Could not find any San Bernardino County articles from KTLA.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Articles loaded",
          description: `Found ${ktlaArticles.length} articles from KTLA.`,
        });
      }
    } catch (error) {
      console.error("Error fetching KTLA articles:", error);
      toast({
        title: "Error loading articles",
        description: "Failed to load KTLA articles. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArticleSelection = (url: string) => {
    const newSelection = new Set(selectedArticles);
    if (newSelection.has(url)) {
      newSelection.delete(url);
    } else {
      newSelection.add(url);
    }
    setSelectedArticles(newSelection);
  };

  const selectAll = () => {
    if (selectedArticles.size === articles.length) {
      // Deselect all
      setSelectedArticles(new Set());
    } else {
      // Select all
      const allUrls = articles.map(article => article.url);
      setSelectedArticles(new Set(allUrls));
    }
  };

  const importSelected = async () => {
    if (selectedArticles.size === 0) {
      toast({
        title: "No articles selected",
        description: "Please select at least one article to import.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    const importedStories: Article[] = [];
    
    try {
      // Get the selected articles
      const selectedArticlesToImport = articles.filter(article => selectedArticles.has(article.url));
      
      // Show progress toast
      toast({
        title: "Importing articles",
        description: `Importing ${selectedArticlesToImport.length} articles. This may take a moment...`,
      });
      
      // Import each article
      for (const article of selectedArticlesToImport) {
        const importedArticle = await importKtlaArticle(article);
        if (importedArticle) {
          importedStories.push(importedArticle);
        }
      }
      
      // Set imported articles
      setImportedArticles(importedStories);
      
      if (importedStories.length > 0) {
        toast({
          title: "Articles imported",
          description: `Successfully imported ${importedStories.length} articles.`,
        });
      } else {
        toast({
          title: "Import failed",
          description: "Failed to import any articles. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error importing articles:", error);
      toast({
        title: "Import error",
        description: "An error occurred while importing the articles.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const addToStories = () => {
    if (importedArticles.length === 0) {
      toast({
        title: "No imported articles",
        description: "Please import articles first before adding to stories.",
        variant: "destructive",
      });
      return;
    }
    
    onAddStories(importedArticles);
    
    toast({
      title: "Stories added",
      description: `Added ${importedArticles.length} stories to your collection.`,
    });
    
    // Reset state
    setSelectedArticles(new Set());
    setImportedArticles([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Import Stories from KTLA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Browse recent San Bernardino County news from KTLA
            </div>
            <Button 
              onClick={fetchArticles} 
              variant="outline" 
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          <Separator />

          {isLoading ? (
            <div className="py-8 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAll}
                >
                  {selectedArticles.size === articles.length ? "Deselect All" : "Select All"}
                </Button>
                <Button 
                  onClick={importSelected} 
                  disabled={selectedArticles.size === 0 || isImporting}
                  size="sm"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import Selected"
                  )}
                </Button>
              </div>

              <Table>
                <TableCaption>Recent San Bernardino County news from KTLA</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-[150px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.url}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedArticles.has(article.url)}
                          onCheckedChange={() => toggleArticleSelection(article.url)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[400px]">
                          {article.url}
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.publishedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No articles found. Click refresh to try again.
            </div>
          )}

          {importedArticles.length > 0 && (
            <div className="mt-6 space-y-4">
              <Separator />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Imported Articles</h3>
                <Button onClick={addToStories}>
                  <Check className="mr-2 h-4 w-4" />
                  Add to Stories
                </Button>
              </div>
              
              <div className="space-y-4">
                {importedArticles.map(article => (
                  <div key={article.id} className="flex gap-4 border rounded-md p-3">
                    <div className="aspect-video w-1/4 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.author}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="rounded-md bg-muted p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>Articles imported from KTLA are automatically categorized based on their content. Images and metadata are extracted from the original source.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
