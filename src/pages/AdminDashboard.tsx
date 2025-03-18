
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  PlusCircle, 
  FileText, 
  Home,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminStoryEditor } from "@/components/admin/AdminStoryEditor";
import { AdminStoryList } from "@/components/admin/AdminStoryList";
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
  const [activeView, setActiveView] = useState<"list" | "editor">("list");
  const [editingStory, setEditingStory] = useState<any | null>(null);

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
  }, [navigate, toast]);

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
                {activeView === "list" ? "Stories Management" : "Story Editor"}
              </h1>
            </div>
            <div>
              {activeView === "list" ? (
                <Button onClick={handleCreateNew}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Story
                </Button>
              ) : (
                <Button variant="outline" onClick={handleBackToList}>
                  Back to Stories
                </Button>
              )}
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {activeView === "list" ? (
              <AdminStoryList onEdit={handleEditStory} />
            ) : (
              <AdminStoryEditor 
                story={editingStory} 
                onCancel={handleBackToList} 
                onSave={handleBackToList} 
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
