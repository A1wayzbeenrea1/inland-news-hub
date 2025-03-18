
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Phone, Mail, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SendUsTips = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tipType: '',
    description: '',
    attachment: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, tipType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Tip Submitted",
        description: "Thank you for your tip! Our editorial team will review it shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        tipType: '',
        description: '',
        attachment: null,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-news-primary text-white p-6">
              <h1 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-2">
                <Send /> Send Us News Tips
              </h1>
              <p className="mt-2">
                Have a story idea or news tip? We want to hear from you! Fill out the form below to send your tip to our editorial team.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-8 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Contact Us Directly</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="text-news-secondary" size={20} />
                    <span>(909) 300-7596</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-news-secondary" size={20} />
                    <span>ie.truenews@gmail.com</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number (optional)
                    </label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="tipType" className="text-sm font-medium">
                      Type of Tip
                    </label>
                    <Select 
                      value={formData.tipType} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breaking">Breaking News</SelectItem>
                        <SelectItem value="investigation">Investigation Idea</SelectItem>
                        <SelectItem value="event">Community Event</SelectItem>
                        <SelectItem value="publicSafety">Public Safety</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Describe Your Tip
                  </label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide as much detail as possible about your news tip..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="attachment" className="text-sm font-medium">
                    Attach Files (optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="attachment"
                      name="attachment"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('attachment')?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload size={16} />
                      {formData.attachment ? formData.attachment.name : 'Choose File'}
                    </Button>
                    {formData.attachment && (
                      <span className="text-sm text-gray-500">
                        {formData.attachment.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    You can attach photos, videos, or documents (max 10MB)
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    type="submit"
                    className="bg-news-secondary hover:bg-news-primary text-white w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={16} />
                        Submit Tip
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-6">
              <h2 className="text-xl font-serif font-bold mb-4">What Makes a Good News Tip?</h2>
              <ul className="space-y-4">
                <li className="flex gap-2">
                  <FileText className="text-news-secondary flex-shrink-0" />
                  <span><strong>Relevance:</strong> Information that affects the Inland Empire community directly.</span>
                </li>
                <li className="flex gap-2">
                  <FileText className="text-news-secondary flex-shrink-0" />
                  <span><strong>Timeliness:</strong> Recent or upcoming events that have news value.</span>
                </li>
                <li className="flex gap-2">
                  <FileText className="text-news-secondary flex-shrink-0" />
                  <span><strong>Impact:</strong> Issues that affect a significant number of people in our coverage area.</span>
                </li>
                <li className="flex gap-2">
                  <FileText className="text-news-secondary flex-shrink-0" />
                  <span><strong>Uniqueness:</strong> Stories that haven't been widely reported elsewhere.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SendUsTips;
