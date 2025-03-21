import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  PlusCircle, 
  FileText, 
  Home,
  Users,
  Settings,
  LogOut,
  Link,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminStoryEditor } from "@/components/admin/AdminStoryEditor";
import { AdminStoryList } from "@/components/admin/AdminStoryList";
import { AdminUrlImporter } from "@/components/admin/AdminUrlImporter";
import { AdminKtlaImporter } from "@/components/admin/AdminKtlaImporter";
import { Article } from "@/data/mockData";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"list" | "editor" | "importer" | "ktla">("list");
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [stories, setStories] = useState<Article[]>([]);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
      toast({
        title: "Access denied",
        description: "Please login to access the admin panel",
        variant: "destructive",
      });
    }
    
    // Load stories from localStorage if available
    const savedStories = localStorage.getItem("adminStories");
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories);
        console.log(`Loaded ${parsedStories.length} admin stories from localStorage`);
        setStories(parsedStories);
      } catch (error) {
        console.error("Error loading stories:", error);
      }
    }
  }, [navigate, toast]);

  // Save stories to localStorage whenever they change
  useEffect(() => {
    if (stories.length > 0) {
      console.log(`Saving ${stories.length} admin stories to localStorage`);
      localStorage.setItem("adminStories", JSON.stringify(stories));
      
      // Display success toast when stories are saved
      toast({
        title: "Stories Saved",
        description: `Successfully saved ${stories.length} stories to local storage`,
      });
    }
  }, [stories, toast]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const handleCreateNew = () => {
    setEditingStory(null);
    setActiveView("editor");
  };

  const handleEditStory = (story: any) => {
    setEditingStory(story);
    setActiveView("editor");
  };

  const handleBackToList = () => {
    setActiveView("list");
    setEditingStory(null);
  };

  const handleSaveStory = (story: Article) => {
    // Make sure the story has a valid date
    if (!story.publishedAt) {
      story.publishedAt = new Date().toISOString();
    }
    
    // Check if story already exists
    const index = stories.findIndex(s => s.id === story.id);
    
    if (index >= 0) {
      // Update existing story
      setStories(prevStories => {
        const newStories = [...prevStories];
        newStories[index] = story;
        return newStories;
      });
      console.log(`Updated story: ${story.title}`);
    } else {
      // Add new story
      setStories(prevStories => [...prevStories, story]);
      console.log(`Added new story: ${story.title}`);
    }
    
    // Save immediately to localStorage
    setTimeout(() => {
      const currentStories = localStorage.getItem("adminStories");
      console.log(`After saving, localStorage has ${currentStories ? JSON.parse(currentStories).length : 0} stories`);
    }, 500);
    
    setActiveView("list");
  };

  const handleAddStoryFromUrl = (story: Article) => {
    // Make sure the story has a valid date
    if (!story.publishedAt) {
      story.publishedAt = new Date().toISOString();
    }
    
    // Add the new story from URL importer
    setStories(prevStories => [...prevStories, story]);
    console.log(`Added new story from URL: ${story.title}`);
    
    // Go back to the list view
    setActiveView("list");
  };

  const handleAddStoriesFromKtla = (newStories: Article[]) => {
    // Make sure all stories have valid dates
    const storiesWithDates = newStories.map(story => {
      if (!story.publishedAt) {
        return {
          ...story,
          publishedAt: new Date().toISOString()
        };
      }
      return story;
    });
    
    // Add multiple stories from KTLA importer
    setStories(prevStories => [...prevStories, ...storiesWithDates]);
    console.log(`Added ${newStories.length} new stories from KTLA`);
    
    // Go back to the list view
    setActiveView("list");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r">
          <SidebarHeader className="px-6 py-3 border-b flex items-center">
            <Layout className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">Admin Panel</span>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Content Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => navigate("/admin/dashboard")}>
                      <Home />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView("list")}>
                      <FileText />
                      <span>Stories</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleCreateNew}>
                      <PlusCircle />
                      <span>New Story</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView("importer")}>
                      <Link />
                      <span>Import from URL</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveView("ktla")}>
                      <ExternalLink />
                      <span>KTLA News</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="px-6 py-3 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4">
                {activeView === "list" 
                  ? "Stories Management" 
                  : activeView === "editor" 
                    ? "Story Editor" 
                    : activeView === "importer"
                      ? "Import from URL"
                      : "KTLA News Import"}
              </h1>
            </div>
            <div>
              {activeView === "list" ? (
                <div className="flex gap-2">
                  <Button onClick={() => setActiveView("ktla")} variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    KTLA News
                  </Button>
                  <Button onClick={() => setActiveView("importer")} variant="outline">
                    <Link className="mr-2 h-4 w-4" />
                    Import from URL
                  </Button>
                  <Button onClick={handleCreateNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Story
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={handleBackToList}>
                  Back to Stories
                </Button>
              )}
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {activeView === "list" ? (
              <AdminStoryList onEdit={handleEditStory} stories={stories} />
            ) : activeView === "editor" ? (
              <AdminStoryEditor 
                story={editingStory} 
                onCancel={handleBackToList} 
                onSave={handleSaveStory} 
              />
            ) : activeView === "importer" ? (
              <AdminUrlImporter onAddStory={handleAddStoryFromUrl} />
            ) : (
              <AdminKtlaImporter onAddStories={handleAddStoriesFromKtla} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
