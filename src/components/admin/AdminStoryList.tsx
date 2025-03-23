import { useState } from "react";
import { 
  Edit, 
  Trash2, 
  Search, 
  Star, 
  StarOff,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Article } from "@/data/mockData";
import { AdminBulkActions } from "./AdminBulkActions";
import { cleanupOldArticles } from "@/utils/adminUtils";

interface AdminStoryListProps {
  onEdit: (story: Article) => void;
  stories?: Article[];
  onStoriesUpdate?: (updatedStories: Article[]) => void;
}

export function AdminStoryList({ onEdit, stories = [], onStoriesUpdate }: AdminStoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<"title" | "publishedAt">("publishedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<{ archived: Article[], kept: Article[] } | null>(null);
  const { toast } = useToast();

  const allStories = stories.length > 0 
    ? stories 
    : [
        {
          id: "1",
          title: "Redlands Community Hospital Expands Emergency Department",
          excerpt: "The expansion adds 15 new treatment rooms and state-of-the-art equipment.",
          content: "Lorem ipsum dolor sit amet...",
          image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
          category: "Health",
          author: "Jane Smith",
          publishedAt: "2023-05-15T14:30:00Z",
          slug: "redlands-hospital-expansion",
          featured: true,
          tags: ["Health", "Infrastructure", "Redlands"]
        },
        {
          id: "2",
          title: "City Council Approves New Downtown Development Plan",
          excerpt: "The $25 million project will include mixed-use spaces and a public plaza.",
          content: "Lorem ipsum dolor sit amet...",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
          category: "Politics",
          author: "John Doe",
          publishedAt: "2023-05-10T09:15:00Z",
          slug: "downtown-development-plan",
          featured: false,
          tags: ["Politics", "Development", "Economy"]
        },
        {
          id: "3",
          title: "Local High School Wins State Championship",
          excerpt: "The Wildcats defeated their rivals 28-21 in a thrilling overtime finish.",
          content: "Lorem ipsum dolor sit amet...",
          image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
          category: "Education",
          author: "Sarah Johnson",
          publishedAt: "2023-05-08T18:45:00Z",
          slug: "high-school-championship",
          featured: true,
          tags: ["Education", "Sports", "Youth"]
        },
      ];

  const filteredStories = allStories.filter(story => {
    const matchesSearch = 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      story.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || story.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(allStories.map(story => story.category))];

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (sortField === "title") {
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      return sortDirection === "asc"
        ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const toggleSort = (field: "title" | "publishedAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: "title" | "publishedAt") => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const handleToggleFeatured = (id: string) => {
    const updatedStories = allStories.map(story => 
      story.id === id ? { ...story, featured: !story.featured } : story
    );
    
    if (onStoriesUpdate) {
      onStoriesUpdate(updatedStories);
    }
    
    toast({
      title: "Story Updated",
      description: `The story has been ${updatedStories.find(s => s.id === id)?.featured ? 'featured' : 'unfeatured'}.`
    });
  };

  const handleDelete = (id: string) => {
    const updatedStories = allStories.filter(story => story.id !== id);
    
    if (onStoriesUpdate) {
      onStoriesUpdate(updatedStories);
    }
    
    toast({
      title: "Story Deleted",
      description: "The story has been permanently deleted."
    });
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedStories.map(story => story.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleCleanupClick = () => {
    setShowCleanupDialog(true);
  };

  const handleRunCleanup = () => {
    const result = cleanupOldArticles(allStories);
    setCleanupResult(result);
    
    if (onStoriesUpdate) {
      onStoriesUpdate(result.kept);
    }
  };

  const handleStoriesUpdate = (updatedStories: Article[]) => {
    if (onStoriesUpdate) {
      onStoriesUpdate(updatedStories);
    }
    
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="default" 
            onClick={handleCleanupClick}
            className="whitespace-nowrap"
          >
            Auto-Cleanup
          </Button>
        </div>
      </div>
      
      <AdminBulkActions 
        selectedIds={selectedIds}
        articles={allStories}
        onArticlesUpdate={handleStoriesUpdate}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedIds.length === sortedStories.length && sortedStories.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>
                <div className="flex items-center">
                  Title
                  {getSortIcon("title")}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => toggleSort("publishedAt")}>
                <div className="flex items-center">
                  Published
                  {getSortIcon("publishedAt")}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No stories found. Try changing your filters or create a new story.
                </TableCell>
              </TableRow>
            ) : (
              sortedStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(story.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(story.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{story.id.substring(0, 4)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{story.title}</div>
                      <div className="text-sm text-muted-foreground hidden md:block">
                        {story.excerpt.substring(0, 60)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {story.category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(story.publishedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {story.featured ? (
                      <Star className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <StarOff className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleFeatured(story.id)}
                        title={story.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {story.featured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(story.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Auto-Cleanup Old Stories</AlertDialogTitle>
            <AlertDialogDescription>
              {!cleanupResult ? (
                <>
                  This will automatically archive stories that are:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Older than 6 months</li>
                    <li>Not marked as featured</li>
                  </ul>
                  <p className="mt-2">Do you want to proceed?</p>
                </>
              ) : (
                <>
                  <p className="font-medium">Cleanup Results:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>{cleanupResult.archived.length} stories archived</li>
                    <li>{cleanupResult.kept.length} stories kept</li>
                  </ul>
                  <p className="mt-2">Cleanup complete!</p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!cleanupResult ? (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRunCleanup}>
                  Run Cleanup
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction onClick={() => setShowCleanupDialog(false)}>
                Close
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
