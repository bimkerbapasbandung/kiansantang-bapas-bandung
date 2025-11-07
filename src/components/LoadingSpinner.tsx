import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export const LoadingSpinner = ({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size],
          className
        )} 
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

// Full page loading
export const LoadingPage = ({ text = 'Memuat...' }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {text}
        </p>
      </div>
    </div>
  );
};

// Inline loading
export const LoadingInline = ({ text }: { text?: string }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin" />
      {text && <span>{text}</span>}
    </div>
  );
};

// Button loading state
export const ButtonLoading = () => {
  return <Loader2 className="w-4 h-4 animate-spin mr-2" />;
};
