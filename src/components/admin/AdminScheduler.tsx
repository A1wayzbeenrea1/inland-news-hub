
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { schedulePublishing, checkScheduledArticles } from "@/utils/adminUtils";
import { Article } from "@/data/mockData";

interface AdminSchedulerProps {
  article: Article;
  onScheduled?: () => void;
}

export const AdminScheduler = ({ article, onScheduled }: AdminSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("pm");
  const { toast } = useToast();

  // Check for scheduled articles on load
  useEffect(() => {
    checkScheduledArticles();
    // Set up an interval to check every minute
    const interval = setInterval(checkScheduledArticles, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date for scheduling.",
        variant: "destructive"
      });
      return;
    }

    // Create publish date from selected date and time
    const publishDate = new Date(date);
    const hourValue = parseInt(hour) + (ampm === "pm" && parseInt(hour) !== 12 ? 12 : 0);
    publishDate.setHours(hourValue, parseInt(minute), 0);

    // Check if date is in the past
    if (publishDate <= new Date()) {
      toast({
        title: "Error",
        description: "Please select a future date and time.",
        variant: "destructive"
      });
      return;
    }

    schedulePublishing(article, publishDate);
    if (onScheduled) onScheduled();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schedule Publication</h3>
      
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="text-sm font-medium">Time</label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="12" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span>:</span>
              
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  {["00", "15", "30", "45"].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={ampm} onValueChange={setAmpm}>
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="AM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="am">AM</SelectItem>
                  <SelectItem value="pm">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSchedule}
          disabled={!date}
          className="mt-4"
        >
          Schedule Publication
        </Button>
      </div>
    </div>
  );
};
