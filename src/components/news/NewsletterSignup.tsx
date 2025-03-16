
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmail('');
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <Card className="border-news-primary border-t-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Mail className="mr-2 h-5 w-5 text-news-primary" /> 
          Subscribe to Our Newsletter
        </CardTitle>
        <CardDescription>
          Get the latest news from the Inland Empire delivered to your inbox daily.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button 
              type="submit" 
              className="bg-news-primary hover:bg-news-secondary sm:w-auto w-full"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        We respect your privacy. Unsubscribe at any time.
      </CardFooter>
    </Card>
  );
};
