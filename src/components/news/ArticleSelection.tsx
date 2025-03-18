
import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpCircle, 
  BarChart2, 
  Search, 
  Maximize2, 
  Zap, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Slider
} from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  seoScore: number;
  interactionRate: number;
  readability: number;
  status: 'published' | 'draft' | 'rejected';
}

const mockArticles: Article[] = [
  { 
    id: '1', 
    title: 'Wildfire containment reaches 60% in Yucaipa area', 
    excerpt: 'Firefighters continue battling blaze in San Bernardino mountains',
    seoScore: 85,
    interactionRate: 78,
    readability: 92,
    status: 'published'
  },
  { 
    id: '2', 
    title: 'Redlands City Council approves new downtown development plan', 
    excerpt: 'The plan includes mixed-use spaces and pedestrian-friendly design',
    seoScore: 92,
    interactionRate: 65,
    readability: 88,
    status: 'published'
  },
  { 
    id: '3', 
    title: 'Ontario International Airport reports record passenger numbers', 
    excerpt: 'Third consecutive month of increased traffic at the regional hub',
    seoScore: 78,
    interactionRate: 82,
    readability: 85,
    status: 'published'
  },
  { 
    id: '4', 
    title: 'Rialto school district announces new STEM program partnership', 
    excerpt: 'Local tech companies provide funding and expertise',
    seoScore: 88,
    interactionRate: 75,
    readability: 93,
    status: 'published'
  },
  { 
    id: '5', 
    title: 'Local restaurant receives health violation citation', 
    excerpt: 'Inspection reveals multiple food safety concerns',
    seoScore: 55,
    interactionRate: 92,
    readability: 78,
    status: 'draft'
  },
  { 
    id: '6', 
    title: 'City budget proposal includes tax increase', 
    excerpt: 'Revenue needed for infrastructure improvements',
    seoScore: 65,
    interactionRate: 45,
    readability: 82,
    status: 'rejected'
  },
  { 
    id: '7', 
    title: 'High school sports team advances to state finals', 
    excerpt: 'First championship appearance in school history',
    seoScore: 75,
    interactionRate: 88,
    readability: 90,
    status: 'draft'
  },
  { 
    id: '8', 
    title: 'Weekend events guide: What to do in the Inland Empire', 
    excerpt: 'Concerts, farmers markets, and family activities',
    seoScore: 95,
    interactionRate: 91,
    readability: 95,
    status: 'published'
  },
];

const performanceData = [
  { month: 'Jan', seoAvg: 72, interactionAvg: 68 },
  { month: 'Feb', seoAvg: 75, interactionAvg: 70 },
  { month: 'Mar', seoAvg: 79, interactionAvg: 72 },
  { month: 'Apr', seoAvg: 82, interactionAvg: 75 },
  { month: 'May', seoAvg: 85, interactionAvg: 78 },
  { month: 'Jun', seoAvg: 88, interactionAvg: 82 },
];

export const ArticleSelection = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [seoThreshold, setSeoThreshold] = useState<number>(70);
  const [interactionThreshold, setInteractionThreshold] = useState<number>(60);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredArticles = articles.filter(article => {
    // Apply search filter
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePublish = (id: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, status: 'published' } 
          : article
      )
    );
  };

  const handleReject = (id: string) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, status: 'rejected' } 
          : article
      )
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Published</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Draft</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const meetsThresholds = (article: Article) => {
    return article.seoScore >= seoThreshold && article.interactionRate >= interactionThreshold;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart2 /> Article Performance Metrics
        </h2>
        
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="seoAvg" 
                stroke="#3b82f6" 
                name="SEO Score Avg" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="interactionAvg" 
                stroke="#10b981" 
                name="Interaction Rate Avg" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Search /> SEO Score Threshold
            </h3>
            <div className="flex items-center mb-2">
              <Slider 
                value={[seoThreshold]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setSeoThreshold(value[0])}
                className="flex-grow mr-4"
              />
              <span className="w-12 text-center font-bold">{seoThreshold}%</span>
            </div>
            <p className="text-sm text-gray-500">
              Articles below this SEO score will be flagged for review
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Zap /> Interaction Rate Threshold
            </h3>
            <div className="flex items-center mb-2">
              <Slider 
                value={[interactionThreshold]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setInteractionThreshold(value[0])}
                className="flex-grow mr-4"
              />
              <span className="w-12 text-center font-bold">{interactionThreshold}%</span>
            </div>
            <p className="text-sm text-gray-500">
              Articles below this interaction rate will be flagged for review
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Maximize2 /> Article Selection
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead className="text-center">SEO Score</TableHead>
                <TableHead className="text-center">Interaction</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id} className={!meetsThresholds(article) ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-gray-500">{article.excerpt}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getScoreColor(article.seoScore)}>
                      {article.seoScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getScoreColor(article.interactionRate)}>
                      {article.interactionRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(article.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {article.status !== 'published' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublish(article.id)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          disabled={!meetsThresholds(article)}
                        >
                          <CheckCircle size={16} />
                        </Button>
                      )}
                      {article.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(article.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p className="flex items-center gap-1">
            <span className="bg-red-50 w-3 h-3 inline-block"></span>
            Articles highlighted in red do not meet the minimum thresholds
          </p>
        </div>
      </div>
    </div>
  );
};
