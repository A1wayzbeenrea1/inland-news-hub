
import { useState } from "react";
import { Trash2, Star, StarOff, Archive, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { performBulkAction } from "@/utils/adminUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Article } from "@/data/mockData";

interface AdminBulkActionsProps {
  selectedIds: string[];
  articles: Article[];
  onArticlesUpdate: (updatedArticles: Article[]) => void;
}

export const AdminBulkActions = ({ 
  selectedIds, 
  articles, 
  onArticlesUpdate 
}: AdminBulkActionsProps) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleBulkAction = (action: 'delete' | 'feature' | 'unfeature' | 'archive') => {
    if (action === 'delete') {
      setShowDeleteDialog(true);
      return;
    }
    
    const { updatedArticles, message } = performBulkAction(articles, selectedIds, action);
    onArticlesUpdate(updatedArticles);
    
    toast({
      title: "Action Complete",
      description: message
    });
  };
  
  const confirmDelete = () => {
    const { updatedArticles, message } = performBulkAction(articles, selectedIds, 'delete');
    onArticlesUpdate(updatedArticles);
    
    toast({
      title: "Action Complete",
      description: message
    });
    
    setShowDeleteDialog(false);
  };
  
  if (selectedIds.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        Select articles to perform bulk actions
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium mr-2">
        {selectedIds.length} selected
      </span>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleBulkAction('feature')}
        title="Feature selected"
      >
        <Star className="h-4 w-4 mr-1" />
        Feature
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleBulkAction('unfeature')}
        title="Unfeature selected"
      >
        <StarOff className="h-4 w-4 mr-1" />
        Unfeature
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleBulkAction('archive')}
        title="Archive selected"
      >
        <Archive className="h-4 w-4 mr-1" />
        Archive
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="text-destructive border-destructive hover:bg-destructive/10"
        onClick={() => handleBulkAction('delete')}
        title="Delete selected"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.length} article{selectedIds.length > 1 ? 's' : ''}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
