
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  apiName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    console.error(`API Error in ${this.props.apiName || 'unknown component'}:`, error, errorInfo);
    
    // Store error info for display
    this.setState({ errorInfo });
    
    // Show toast notification
    toast({
      title: "API Error",
      description: `Failed to fetch data${this.props.apiName ? ` from ${this.props.apiName}` : ''}. Try refreshing.`,
      variant: "destructive",
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Call the parent's retry handler if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Data Loading Error</h2>
          </div>
          <p className="text-gray-700 mb-6 text-center max-w-md">
            We couldn't load the latest data from our API. This might be due to a temporary connection issue.
          </p>
          
          <div className="bg-white p-3 rounded text-sm text-gray-700 mb-6 max-w-full overflow-x-auto w-full">
            <p className="font-medium">Error: {this.state.error?.message}</p>
            {this.props.apiName && <p className="text-xs text-gray-500 mt-1">Service: {this.props.apiName}</p>}
          </div>
          
          <Button 
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
