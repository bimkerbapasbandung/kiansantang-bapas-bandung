import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                  <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Oops! Terjadi Kesalahan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Maaf, aplikasi mengalami masalah. Silakan coba lagi atau hubungi administrator.
                </p>
              </div>

              {/* Error Details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs font-mono text-gray-600 dark:text-gray-400">
                      <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-64 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={this.handleReset}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </div>

              {/* Support Info */}
              <div className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
                <p>Jika masalah berlanjut, hubungi:</p>
                <p className="font-semibold">support@bapas-bandung.kemenkumham.go.id</p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
