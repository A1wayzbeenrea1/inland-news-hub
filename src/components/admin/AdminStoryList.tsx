
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Search, 
  Edit, 
  Trash, 
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";

// Sample mock data - in a real app this would come from an API
const mockStories = [
  {
    id: "1",
    title: "Redlands City Council Approves Downtown Development Plan",
    slug: "redlands-city-council-approves-downtown-development-plan",
    status: "published",
    category: "local",
    publishDate: "2023-10-15",
    featured: true,
    seoScore: 87,
  },
  {
    id: "2",
    title: "Local Business Owner Receives Community Leadership Award",
    slug: "local-business-owner-receives-award",
    status: "published",
    category: "business",
    publishDate: "2023-10-12",
    featured: false,
    seoScore: 75,
  },
  {
    id: "3",
    title: "School District Announces New Educational Initiative",
    slug: "school-district-announces-new-initiative",
    status: "draft",
    category: "education",
    publishDate: null,
    featured: false,
    seoScore: 62,
  },
  {
    id: "4",
    title: "Annual Fall Festival Returns With New Attractions",
    slug: "annual-fall-festival-returns",
    status: "published",
    category: "entertainment",
    publishDate: "2023-09-28",
    featured: true,
    seoScore: 91,
  },
  {
    id: "5",
    title: "City Budget Proposal Raises Questions Among Residents",
    slug: "city-budget-proposal-raises-questions",
    status: "review",
    category: "politics",
    publishDate: null,
    featured: false,
    seoScore: 68,
  },
];

interface AdminStoryListProps {
  onEdit: (story: any) => void;
}

export function AdminStoryList({ onEdit }: AdminStoryListProps) {
  const { toast } = useToast();
  const [stories, setStories] = useState(mockStories);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<any>(null);

  // Filter stories based on search term
  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle story deletion
  const handleDeleteStory = () => {
    if (!storyToDelete) return;
    
    // Filter out the story to delete
    const updatedStories = stories.filter(story => story.id !== storyToDelete.id);
    setStories(updatedStories);
    
    toast({
      title: "Story deleted",
      description: `"${storyToDelete.title}" has been deleted.`,
    });
    
    setDeleteDialogOpen(false);
    setStoryToDelete(null);
  };

  // Handle story status change
  const handleStatusChange = (story: any, newStatus: "published" | "draft" | "review") => {
    const updatedStories = stories.map(s => 
      s.id === story.id ? { ...s, status: newStatus } : s
    );
    
    setStories(updatedStories);
    
    toast({
      title: "Status updated",
      description: `"${story.title}" is now ${newStatus}.`,
    });
  };

  // Handle featured toggle
  const handleFeaturedToggle = (story: any) => {
    const updatedStories = stories.map(s => 
      s.id === story.id ? { ...s, featured: !s.featured } : s
    );
    
    setStories(updatedStories);
    
    toast({
      title: story.featured ? "Removed from featured" : "Added to featured",
      description: `"${story.title}" ${story.featured ? "removed from" : "added to"} featured stories.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories by title or category..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of all stories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>SEO Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No stories found
                </TableCell>
              </TableRow>
            ) : (
              filteredStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="font-medium">{story.title}</TableCell>
                  <TableCell className="capitalize">{story.category}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      story.status === "published" ? "bg-green-100 text-green-800" :
                      story.status === "draft" ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {story.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {story.featured ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-full h-2 rounded-full ${
                        story.seoScore >= 80 ? "bg-green-100" :
                        story.seoScore >= 60 ? "bg-yellow-100" :
                        "bg-red-100"
                      }`}>
                        <div 
                          className={`h-2 rounded-full ${
                            story.seoScore >= 80 ? "bg-green-500" :
                            story.seoScore >= 60 ? "bg-yellow-500" :
                            "bg-red-500"
                          }`}
                          style={{ width: `${story.seoScore}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm">{story.seoScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(story)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/article/${story.slug}`, "_blank")}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleFeaturedToggle(story)}>
                          {story.featured ? (
                            <>Remove from featured</>
                          ) : (
                            <>Add to featured</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            setStoryToDelete(story);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the story. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
