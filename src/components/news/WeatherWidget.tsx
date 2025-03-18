
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, CloudSun, Sun, CloudRain, CloudFog } from 'lucide-react';

interface WeatherWidgetProps {
  location?: string;
  className?: string;
}

// This is a mock implementation - in a real app, you would fetch real weather data
export const WeatherWidget = ({ location = 'Inland Empire', className }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState({
    temp: 78,
    condition: 'Sunny',
    high: 85,
    low: 68,
    humidity: 45,
    windSpeed: 8,
    icon: Sun
  });

  // Mock implementation to show different weather for different locations
  useEffect(() => {
    // This would be replaced with a real API call
    const mockWeatherByLocation: Record<string, typeof weather> = {
      'Redlands': {
        temp: 82,
        condition: 'Sunny',
        high: 88,
        low: 70,
        humidity: 42,
        windSpeed: 6,
        icon: Sun
      },
      'Yucaipa': {
        temp: 80,
        condition: 'Partly Cloudy',
        high: 86,
        low: 69,
        humidity: 48,
        windSpeed: 9,
        icon: CloudSun
      },
      'Rialto': {
        temp: 84,
        condition: 'Cloudy',
        high: 89,
        low: 72,
        humidity: 50,
        windSpeed: 7,
        icon: Cloud
      },
      'Ontario': {
        temp: 83,
        condition: 'Partly Cloudy',
        high: 90,
        low: 71,
        humidity: 47,
        windSpeed: 8,
        icon: CloudSun
      },
      'Loma Linda': {
        temp: 81,
        condition: 'Sunny',
        high: 87,
        low: 70,
        humidity: 44,
        windSpeed: 5,
        icon: Sun
      }
    };

    const locationWeather = mockWeatherByLocation[location] || {
      temp: 78,
      condition: 'Sunny',
      high: 85,
      low: 68,
      humidity: 45,
      windSpeed: 8,
      icon: Sun
    };

    setWeather(locationWeather);
  }, [location]);

  const WeatherIcon = weather.icon;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Weather</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <WeatherIcon className="h-8 w-8 text-news-primary" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-3xl font-bold">{weather.temp}°F</span>
          <span className="text-gray-600">{weather.condition}</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">High</p>
            <p className="font-medium">{weather.high}°F</p>
          </div>
          <div>
            <p className="text-gray-500">Low</p>
            <p className="font-medium">{weather.low}°F</p>
          </div>
          <div>
            <p className="text-gray-500">Humidity</p>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-gray-500">Wind</p>
            <p className="font-medium">{weather.windSpeed} mph</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
