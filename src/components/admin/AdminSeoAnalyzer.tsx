
import { useState } from "react";
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSEO } from "@/utils/adminUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface AdminSeoAnalyzerProps {
  initialContent?: string;
  onSuggestionApply?: (newContent: string) => void;
}

export const AdminSeoAnalyzer = ({ 
  initialContent = "", 
  onSuggestionApply 
}: AdminSeoAnalyzerProps) => {
  const [content, setContent] = useState(initialContent);
  const [analysis, setAnalysis] = useState<{ score: number; recommendations: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const result = analyzeSEO(content);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">SEO Content Analyzer</h3>
        {analysis && (
          <div className="flex items-center gap-2">
            <span className={`font-bold ${getScoreColor(analysis.score)}`}>
              Score: {analysis.score}/100
            </span>
            {getScoreIcon(analysis.score)}
          </div>
        )}
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your article content to analyze..."
        className="min-h-[150px]"
      />

      <div className="flex justify-end">
        <Button onClick={handleAnalyzeClick} disabled={isAnalyzing || !content.trim()}>
          {isAnalyzing ? (
            <>Analyzing...</>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analyze Content
            </>
          )}
        </Button>
      </div>

      {isAnalyzing && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Analyzing content...</p>
          <Progress value={45} className="h-2" />
        </div>
      )}

      {analysis && analysis.recommendations.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium">Recommendations:</h4>
          {analysis.recommendations.map((recommendation, index) => (
            <Alert key={index} variant={analysis.score >= 80 ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Improvement Suggestion</AlertTitle>
              <AlertDescription>{recommendation}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {analysis && analysis.recommendations.length === 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Great job!</AlertTitle>
          <AlertDescription>
            Your content looks good from an SEO perspective. No recommendations at this time.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
