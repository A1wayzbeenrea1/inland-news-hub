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
  ExternalLink,
  BarChart2,
  Clock,
  Globe,
  Rss
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminStoryEditor } from "@/components/admin/AdminStoryEditor";
import { AdminStoryList } from "@/components/admin/AdminStoryList";
import { AdminUrlImporter } from "@/components/admin/AdminUrlImporter";
import { AdminKtlaImporter } from "@/components/admin/AdminKtlaImporter";
import { AdminLocalNewsSelector } from "@/components/admin/AdminLocalNewsSelector";
import { Article } from "@/data/mockData";
import { checkScheduledArticles } from "@/utils/adminUtils";
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

type ActiveView = "list" | "editor" | "importer" | "ktla" | "analytics" | "localnews";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<ActiveView>("list");
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
    const loadAdminStories = () => {
      const savedStories = localStorage.getItem("adminStories");
      if (savedStories) {
        try {
          const parsedStories = JSON.parse(savedStories);
          console.log(`Loaded ${parsedStories.length} admin stories from localStorage`);
          
          // Ensure all stories have valid dates
          const storiesWithValidDates = parsedStories.map((story: Article) => {
            if (!story.publishedAt || isNaN(new Date(story.publishedAt).getTime())) {
              console.log(`Story with invalid date found: ${story.title}`);
              return {
                ...story,
                publishedAt: new Date().toISOString()
              };
            }
            return story;
          });
          
          setStories(storiesWithValidDates);
        } catch (error) {
          console.error("Error loading stories:", error);
        }
      }
    };
    
    loadAdminStories();
    
    // Check for scheduled articles
    checkScheduledArticles();
    const scheduledInterval = setInterval(checkScheduledArticles, 60000); // Check every minute
    
    return () => {
      clearInterval(scheduledInterval);
    };
  }, [navigate, toast]);

  // Save stories to localStorage whenever they change
  useEffect(() => {
    if (stories.length > 0) {
      // Make sure all stories have valid dates before saving
      const sanitizedStories = stories.map(story => {
        if (!story.publishedAt || isNaN(new Date(story.publishedAt).getTime())) {
          return {
            ...story,
            publishedAt: new Date().toISOString()
          };
        }
        return story;
      });
      
      console.log(`Saving ${sanitizedStories.length} admin stories to localStorage`);
      localStorage.setItem("adminStories", JSON.stringify(sanitizedStories));
      
      // Display success toast when stories are saved
      toast({
        title: "Stories Saved",
        description: `Successfully saved ${sanitizedStories.length} stories to local storage`,
      });
      
      // Log the saved stories for debugging
      console.log('Saved admin stories:', 
        sanitizedStories.map(story => ({
          id: story.id,
          title: story.title,
          date: new Date(story.publishedAt).toLocaleString(),
          category: story.category
        }))
      );
      
      // Force a refresh of the stories in mockData by clearing any cached data
      localStorage.setItem("forceRefresh", Date.now().toString());
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
    // Make sure the story has a valid date and is marked as an admin story
    const enhancedStory = {
      ...story,
      publishedAt: story.publishedAt || new Date().toISOString(),
      source: "Admin" // Mark as admin source for identification
    };
    
    // Check if story already exists
    const index = stories.findIndex(s => s.id === enhancedStory.id);
    
    if (index >= 0) {
      // Update existing story
      setStories(prevStories => {
        const newStories = [...prevStories];
        newStories[index] = enhancedStory;
        return newStories;
      });
      console.log(`Updated story: ${enhancedStory.title}`);
    } else {
      // Add new story
      setStories(prevStories => [...prevStories, enhancedStory]);
      console.log(`Added new story: ${enhancedStory.title}`);
    }
    
    // Save immediately to localStorage
    setTimeout(() => {
      const currentStories = localStorage.getItem("adminStories");
      console.log(`After saving, localStorage has ${currentStories ? JSON.parse(currentStories).length : 0} stories`);
    }, 500);
    
    setActiveView("list");
  };

  const handleAddStoryFromUrl = (story: Article) => {
    // Make sure the story has a valid date and is marked as an admin story
    const enhancedStory = {
      ...story,
      publishedAt: story.publishedAt || new Date().toISOString(),
      source: "Admin" // Mark as admin source for identification
    };
    
    // Add the new story from URL importer
    setStories(prevStories => [...prevStories, enhancedStory]);
    console.log(`Added new story from URL: ${enhancedStory.title}`);
    
    // Go back to the list view
    setActiveView("list");
  };

  const handleAddStoriesFromKtla = (newStories: Article[]) => {
    // Make sure all stories have valid dates and are marked as admin stories
    const storiesWithDates = newStories.map(story => ({
      ...story,
      publishedAt: story.publishedAt || new Date().toISOString(),
      source: "Admin" // Mark as admin source for identification
    }));
    
    // Add multiple stories from KTLA importer
    setStories(prevStories => [...prevStories, ...storiesWithDates]);
    console.log(`Added ${newStories.length} new stories from KTLA`);
    
    // Go back to the list view
    setActiveView("list");
  };
  
  // Handle story updates from the AdminStoryList component
  const handleStoriesUpdate = (updatedStories: Article[]) => {
    setStories(updatedStories);
  };

  const handleAddStoriesFromLocalNews = (newStories: Article[]) => {
    // Make sure all stories have valid dates and are marked as admin stories
    const storiesWithDates = newStories.map(story => ({
      ...story,
      publishedAt: story.publishedAt || new Date().toISOString(),
      source: story.source || "Local News API" // Preserve original source
    }));
    
    // Add multiple stories from Local News API
    setStories(prevStories => [...prevStories, ...storiesWithDates]);
    console.log(`Added ${newStories.length} new stories from Local News API`);
    
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
                    <SidebarMenuButton onClick={() => setActiveView("localnews")}>
                      <Globe />
                      <span>Local News API</span>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => navigate("/admin/article-selection")}>
                      <BarChart2 />
                      <span>Analytics</span>
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
            
            {/* Display scheduled articles info */}
            <SidebarGroup>
              <SidebarGroupLabel>Scheduled Content</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <ScheduledArticlesCount />
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Add RSS Feeds section */}
            <SidebarGroup>
              <SidebarGroupLabel>External Sources</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <div className="flex items-center text-sm">
                    <Rss className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>RSS Feeds: 3 active</span>
                  </div>
                </div>
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
                      : activeView === "ktla"
                        ? "KTLA News Import"
                        : activeView === "localnews"
                          ? "Local News API"
                          : "Analytics"}
              </h1>
            </div>
            <div>
              {activeView === "list" ? (
                <div className="flex gap-2">
                  <Button onClick={() => setActiveView("localnews")} variant="outline">
                    <Globe className="mr-2 h-4 w-4" />
                    Local News API
                  </Button>
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
              <AdminStoryList 
                onEdit={handleEditStory} 
                stories={stories}
                onStoriesUpdate={handleStoriesUpdate}
              />
            ) : activeView === "editor" ? (
              <AdminStoryEditor 
                story={editingStory} 
                onCancel={handleBackToList} 
                onSave={handleSaveStory} 
              />
            ) : activeView === "importer" ? (
              <AdminUrlImporter onAddStory={handleAddStoryFromUrl} />
            ) : activeView === "ktla" ? (
              <AdminKtlaImporter onAddStories={handleAddStoriesFromKtla} />
            ) : activeView === "localnews" ? (
              <AdminLocalNewsSelector onAddStories={handleAddStoriesFromLocalNews} />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Analytics view will be implemented in a future update.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Component to display the number of scheduled articles
const ScheduledArticlesCount = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const getScheduledCount = () => {
      try {
        const scheduled = JSON.parse(localStorage.getItem("scheduledArticles") || "[]");
        setCount(scheduled.length);
      } catch (error) {
        console.error("Error getting scheduled articles count:", error);
        setCount(0);
      }
    };
    
    getScheduledCount();
    const interval = setInterval(getScheduledCount, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span>{count} article{count !== 1 ? 's' : ''} scheduled</span>
  );
};

export default AdminDashboard;
