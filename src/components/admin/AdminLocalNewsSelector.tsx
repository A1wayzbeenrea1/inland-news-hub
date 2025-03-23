
import { useState, useEffect } from "react";
import { RefreshCw, FilePlus, Filter, ExternalLink, Check, Loader2, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AdminSeoAnalyzer } from "./AdminSeoAnalyzer";
import { fetchLocalNewsArticles } from "@/services/localNewsApiService";
import { Article } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminLocalNewsSelectorProps {
  onAddStories: (stories: Article[]) => void;
}

export function AdminLocalNewsSelector({ onAddStories }: AdminLocalNewsSelectorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [autoImportEnabled, setAutoImportEnabled] = useState(false);
  const [autoImportInterval, setAutoImportInterval] = useState('60');
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  // Load auto-import settings from localStorage
  useEffect(() => {
    const savedAutoImport = localStorage.getItem('localNewsAutoImport');
    const savedInterval = localStorage.getItem('localNewsAutoImportInterval');
    const savedLastFetched = localStorage.getItem('localNewsLastFetched');
    
    if (savedAutoImport) {
      setAutoImportEnabled(savedAutoImport === 'true');
    }
    
    if (savedInterval) {
      setAutoImportInterval(savedInterval);
    }
    
    if (savedLastFetched) {
      setLastFetched(savedLastFetched);
    }
  }, []);

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
    
    // Set up auto-import if enabled
    if (autoImportEnabled) {
      setupAutoImport();
    }
    
    return () => {
      // Clean up interval on unmount
      if (window.localNewsAutoImportInterval) {
        clearInterval(window.localNewsAutoImportInterval);
        window.localNewsAutoImportInterval = null;
      }
    };
  }, []);

  // Setup auto-import interval
  const setupAutoImport = () => {
    if (window.localNewsAutoImportInterval) {
      clearInterval(window.localNewsAutoImportInterval);
    }
    
    const minutes = parseInt(autoImportInterval, 10) || 60;
    console.log(`Setting up auto-import every ${minutes} minutes`);
    
    window.localNewsAutoImportInterval = setInterval(() => {
      console.log("Auto-importing local news articles");
      fetchArticles(true);
    }, minutes * 60 * 1000);
  };

  // Toggle auto-import
  const toggleAutoImport = (enabled: boolean) => {
    setAutoImportEnabled(enabled);
    localStorage.setItem('localNewsAutoImport', enabled.toString());
    
    if (enabled) {
      setupAutoImport();
    } else if (window.localNewsAutoImportInterval) {
      clearInterval(window.localNewsAutoImportInterval);
      window.localNewsAutoImportInterval = null;
    }
  };

  // Update auto-import interval
  const updateAutoImportInterval = (interval: string) => {
    setAutoImportInterval(interval);
    localStorage.setItem('localNewsAutoImportInterval', interval);
    
    if (autoImportEnabled) {
      setupAutoImport();
    }
  };

  const fetchArticles = async (isAuto = false) => {
    setIsLoading(true);
    try {
      const localNewsArticles = await fetchLocalNewsArticles();
      setArticles(localNewsArticles);
      setLastFetched(new Date().toISOString());
      localStorage.setItem('localNewsLastFetched', new Date().toISOString());
      
      if (localNewsArticles.length === 0) {
        toast({
          title: "No articles found",
          description: "Could not find any local news articles. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Articles ${isAuto ? 'auto-' : ''}loaded`,
          description: `Found ${localNewsArticles.length} articles from ${getUniqueSourcesCount(localNewsArticles)} sources.`,
        });
      }
      
      // Reset selection when articles change
      setSelectedArticles(new Set());
    } catch (error) {
      console.error("Error fetching local news articles:", error);
      toast({
        title: "Error loading articles",
        description: "Failed to load local news articles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueSourcesCount = (articles: Article[]): number => {
    const sources = new Set(articles.map(a => a.source || 'Unknown'));
    return sources.size;
  };

  const toggleArticleSelection = (id: string) => {
    const newSelection = new Set(selectedArticles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedArticles(newSelection);
  };

  const selectAll = () => {
    if (selectedArticles.size === filteredArticles.length) {
      // Deselect all
      setSelectedArticles(new Set());
    } else {
      // Select all filtered articles
      const ids = filteredArticles.map(article => article.id);
      setSelectedArticles(new Set(ids));
    }
  };

  const addSelectedToStories = () => {
    if (selectedArticles.size === 0) {
      toast({
        title: "No articles selected",
        description: "Please select at least one article to add.",
        variant: "destructive",
      });
      return;
    }
    
    // Get selected articles
    const selectedStories = articles.filter(article => selectedArticles.has(article.id));
    
    onAddStories(selectedStories);
    
    toast({
      title: "Stories added",
      description: `Added ${selectedStories.length} stories to your collection.`,
    });
    
    // Reset selection
    setSelectedArticles(new Set());
  };
  
  // Open preview dialog
  const openPreview = (article: Article) => {
    setPreviewArticle(article);
    setShowPreview(true);
  };
  
  // Format date for better display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Get all unique sources for filter
  const getUniqueSources = (): string[] => {
    return Array.from(new Set(articles.map(a => a.source || 'Unknown')));
  };
  
  // Get all unique categories for filter
  const getUniqueCategories = (): string[] => {
    return Array.from(new Set(articles.map(a => a.category)));
  };
  
  // Filter articles based on search term, source filter, and category filter
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || article.source === sourceFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesSource && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            <span>Local News API</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-import-switch" className="text-sm">Auto-Import</Label>
              <Switch 
                id="auto-import-switch" 
                checked={autoImportEnabled}
                onCheckedChange={toggleAutoImport}
              />
            </div>
            
            {autoImportEnabled && (
              <Select value={autoImportInterval} onValueChange={updateAutoImportInterval}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Update interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="120">Every 2 hours</SelectItem>
                  <SelectItem value="240">Every 4 hours</SelectItem>
                  <SelectItem value="480">Every 8 hours</SelectItem>
                  <SelectItem value="720">Every 12 hours</SelectItem>
                  <SelectItem value="1440">Every day</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {lastFetched ? (
                <span>Last updated: {formatDate(lastFetched)}</span>
              ) : (
                <span>Never updated</span>
              )}
            </div>
            <Button 
              onClick={() => fetchArticles()} 
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {getUniqueSources().length > 1 && (
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {getUniqueSources().map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {getUniqueCategories().length > 1 && (
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAll}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedArticles.size === filteredArticles.length ? "Deselect All" : "Select All"}
                </Button>
                <Button 
                  onClick={addSelectedToStories} 
                  disabled={selectedArticles.size === 0}
                  size="sm"
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Selected ({selectedArticles.size})
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableCaption>Local news articles ({filteredArticles.length} of {articles.length})</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Select</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[120px]">Source</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="w-[150px]">Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedArticles.has(article.id)}
                              onCheckedChange={() => toggleArticleSelection(article.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium line-clamp-2">{article.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {article.excerpt}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {article.source || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-normal">
                              {article.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(article.publishedAt)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openPreview(article)}
                              title="Preview article"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No articles match your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No articles found. Click refresh to try again.
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Article preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewArticle?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge variant="outline">{previewArticle?.source}</Badge>
              <Badge variant="secondary">{previewArticle?.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {previewArticle ? formatDate(previewArticle.publishedAt) : ''}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          {previewArticle && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <div className="aspect-video rounded-md overflow-hidden bg-muted mb-4">
                    <img 
                      src={previewArticle.image} 
                      alt={previewArticle.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: previewArticle.content }} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">SEO Analysis</h3>
                  <AdminSeoAnalyzer 
                    initialContent={previewArticle.content} 
                  />
                  
                  {previewArticle.url && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Original Source</h3>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => window.open(previewArticle.url, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Original
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => {
                    onAddStories([previewArticle]);
                    setShowPreview(false);
                    toast({
                      title: "Story added",
                      description: "The article has been added to your collection.",
                    });
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Add to Stories
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Add the missing type definition for the window object
declare global {
  interface Window {
    localNewsAutoImportInterval: ReturnType<typeof setInterval> | null;
  }
}

// Initialize the property
window.localNewsAutoImportInterval = null;
