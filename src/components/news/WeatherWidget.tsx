
import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CityWeather {
  city: string;
  currentTemp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
  highTemp: number;
  lowTemp: number;
  humidity: number;
  wind: number;
}

export const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([
    {
      city: 'Redlands',
      currentTemp: 78,
      condition: 'sunny',
      highTemp: 84,
      lowTemp: 62,
      humidity: 42,
      wind: 5
    },
    {
      city: 'Yucaipa',
      currentTemp: 76,
      condition: 'cloudy',
      highTemp: 82,
      lowTemp: 59,
      humidity: 45,
      wind: 8
    },
    {
      city: 'Rialto',
      currentTemp: 80,
      condition: 'sunny',
      highTemp: 86,
      lowTemp: 64,
      humidity: 38,
      wind: 6
    },
    {
      city: 'Ontario',
      currentTemp: 82,
      condition: 'cloudy',
      highTemp: 88,
      lowTemp: 65,
      humidity: 39,
      wind: 7
    }
  ]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-400" />;
      case 'snowy':
        return <CloudSnow className="h-6 w-6 text-blue-200" />;
      case 'stormy':
        return <CloudLightning className="h-6 w-6 text-purple-500" />;
      case 'foggy':
        return <CloudFog className="h-6 w-6 text-gray-300" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <h3 className="text-white font-bold">Current Weather</h3>
      </div>
      <Tabs defaultValue={weatherData[0].city.toLowerCase()}>
        <TabsList className="w-full">
          {weatherData.map((data) => (
            <TabsTrigger 
              key={data.city}
              value={data.city.toLowerCase()}
              className="flex-1"
            >
              {data.city}
            </TabsTrigger>
          ))}
        </TabsList>
        {weatherData.map((data) => (
          <TabsContent 
            key={data.city}
            value={data.city.toLowerCase()}
            className="p-0"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getWeatherIcon(data.condition)}
                  <span className="ml-2 text-3xl font-bold">{data.currentTemp}°</span>
                </div>
                <Badge variant="outline" className="border-blue-200">
                  {data.condition.charAt(0).toUpperCase() + data.condition.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">High</span>
                  <span className="font-medium">{data.highTemp}°</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Low</span>
                  <span className="font-medium">{data.lowTemp}°</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Humidity</span>
                  <span className="font-medium">{data.humidity}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Wind</span>
                  <span className="font-medium">{data.wind} mph</span>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
