
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Save, X, Lightbulb, Calendar, Sparkles } from "lucide-react";
import { Article } from "@/data/mockData";
import { AdminSeoAnalyzer } from "./AdminSeoAnalyzer";
import { AdminScheduler } from "./AdminScheduler";
import { createSlugFromTitle } from "@/utils/adminUtils";

const storySchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  slug: z.string().min(5, {
    message: "Slug must be at least 5 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }),
  featured: z.boolean().default(false),
});

type StoryFormValues = z.infer<typeof storySchema>;

interface AdminStoryEditorProps {
  story?: Article | null;
  onCancel: () => void;
  onSave: (story: Article) => void;
}

export function AdminStoryEditor({ story, onCancel, onSave }: AdminStoryEditorProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(story?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // Initialize form with existing story data or defaults
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: story?.title || "",
      slug: story?.slug || "",
      content: story?.content || "",
      category: story?.category || "",
      excerpt: story?.excerpt || "",
      featured: story?.featured || false,
    },
  });

  // Watch content for SEO analysis
  const content = form.watch("content");

  // Generate slug from title
  const generateSlug = (title: string) => {
    const slug = createSlugFromTitle(title);
    form.setValue("slug", slug);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply AI-suggested improvements
  const handleApplySuggestion = (newContent: string) => {
    form.setValue("content", newContent);
    toast({
      title: "Content Updated",
      description: "AI suggestions applied to your content.",
    });
  };

  // Handle form submission
  const onSubmit = (data: StoryFormValues) => {
    setIsSubmitting(true);
    
    // Prepare the story object with current timestamp
    const currentDate = new Date().toISOString();
    const savedStory: Article = {
      id: story?.id || `admin-story-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      content: data.content,
      category: data.category,
      excerpt: data.excerpt,
      featured: data.featured,
      image: imagePreview || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop",
      author: story?.author || "Admin User",
      publishedAt: currentDate, // Always use current date for new/updated stories
      tags: story?.tags || [data.category, "News", "Inland Empire"],
      source: "Admin" // Mark as admin source for identification
    };
    
    console.log(`Saving story with date: ${savedStory.publishedAt}`);
    
    setTimeout(() => {
      toast({
        title: story ? "Story updated" : "Story created",
        description: `"${data.title}" has been successfully ${story ? "updated" : "saved"}.`,
      });
      
      // Force a refresh in the MockData cache
      localStorage.setItem("forceRefresh", Date.now().toString());
      
      setIsSubmitting(false);
      onSave(savedStory);
    }, 1000);
  };

  // Auto-generate excerpt from content if not provided
  const generateExcerpt = () => {
    const contentValue = form.getValues("content");
    if (contentValue && contentValue.length > 20) {
      const excerpt = contentValue.substring(0, 150).replace(/\s+/g, ' ').trim() + "...";
      form.setValue("excerpt", excerpt);
      toast({
        title: "Excerpt Generated",
        description: "An excerpt has been automatically generated from your content.",
      });
    } else {
      toast({
        title: "Not enough content",
        description: "Please add more content before generating an excerpt.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="edit">
              <Save className="mr-2 h-4 w-4" />
              Edit Story
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Lightbulb className="mr-2 h-4 w-4" />
              SEO Analysis
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Story title" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                if (!story) {
                                  generateSlug(e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="url-friendly-slug" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Public Safety">Public Safety</SelectItem>
                              <SelectItem value="Politics">Politics</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Health">Health</SelectItem>
                              <SelectItem value="Environment">Environment</SelectItem>
                              <SelectItem value="Community">Community</SelectItem>
                              <SelectItem value="Sports">Sports</SelectItem>
                              <SelectItem value="Entertainment">Entertainment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            <span>Excerpt</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={generateExcerpt}
                              className="h-7 px-2 text-xs"
                            >
                              <Sparkles className="mr-1 h-3 w-3" />
                              Auto-Generate
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief summary of the story" 
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Featured Image</FormLabel>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                      {imagePreview && (
                        <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setImagePreview(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your story content here..." 
                              className="h-[400px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Story</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              This story will be highlighted on the homepage.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {story ? "Update Story" : "Publish Story"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="seo">
            <AdminSeoAnalyzer 
              initialContent={content} 
              onSuggestionApply={handleApplySuggestion}
            />
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setActiveTab("edit")}
                variant="outline"
              >
                Back to Editor
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            {story ? (
              <AdminScheduler 
                article={{
                  ...story,
                  title: form.getValues("title"),
                  content: form.getValues("content"),
                  excerpt: form.getValues("excerpt"),
                  slug: form.getValues("slug"),
                  category: form.getValues("category"),
                  featured: form.getValues("featured"),
                  image: imagePreview || story.image,
                }}
                onScheduled={onCancel}
              />
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p>Please save your story first before scheduling it for publication.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setActiveTab("edit")}
                >
                  Back to Editor
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
