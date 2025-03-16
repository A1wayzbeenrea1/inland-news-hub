
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'community' | 'government' | 'arts' | 'sports';
}

export const EventsCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Redlands City Council Meeting',
      date: new Date(2023, 6, 5), // July 5, 2023
      type: 'government'
    },
    {
      id: '2',
      title: 'Yucaipa Farmers Market',
      date: new Date(2023, 6, 8), // July 8, 2023
      type: 'community'
    },
    {
      id: '3',
      title: 'Ontario Arts Festival',
      date: new Date(2023, 6, 15), // July 15, 2023
      type: 'arts'
    },
    {
      id: '4',
      title: 'Rialto High School Football Game',
      date: new Date(2023, 6, 22), // July 22, 2023
      type: 'sports'
    }
  ];

  // Function to find events on a specific date
  const getEventsForDate = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Get events for the selected date
  const selectedDateEvents = date ? getEventsForDate(date) : [];

  // Function to check if a day has events
  const dayHasEvents = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const getBadgeColor = (type: Event['type']) => {
    switch (type) {
      case 'community': return 'bg-green-500 hover:bg-green-600';
      case 'government': return 'bg-blue-500 hover:bg-blue-600';
      case 'arts': return 'bg-purple-500 hover:bg-purple-600';
      case 'sports': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <CalendarDays className="mr-2 h-5 w-5 text-news-primary" />
          Community Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mb-4"
          modifiers={{
            hasEvent: (date) => dayHasEvents(date),
          }}
          modifiersStyles={{
            hasEvent: { 
              fontWeight: 'bold',
              textDecoration: 'underline', 
              textDecorationColor: 'var(--news-primary)',
              textDecorationThickness: '2px'
            }
          }}
        />
        
        {selectedDateEvents.length > 0 ? (
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">
              Events on {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}:
            </h4>
            {selectedDateEvents.map(event => (
              <div key={event.id} className="flex items-center space-x-2">
                <Badge className={`${getBadgeColor(event.type)} border-none`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No events scheduled for this date.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
