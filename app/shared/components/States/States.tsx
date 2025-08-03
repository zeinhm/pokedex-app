import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@components/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  title = "Oops! Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryText = "Try Again",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h3 className="text-red-300 text-lg font-semibold mb-2">{title}</h3>
        <p className="text-red-200 mb-4">{message}</p>
        {onRetry && (
          <div className="mt-4">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-300 hover:bg-red-500/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface LoadingStateProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({
  title = "Loading...",
  description,
  size = "md",
  className = "",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      <div className="text-center">
        <Loader2
          className={`${sizeClasses[size]} animate-spin mx-auto mb-4 text-purple-400`}
        />
        <p className={`text-gray-300 ${textSizeClasses[size]} mb-2`}>{title}</p>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filter criteria",
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/50">
        <p className="text-gray-400 text-lg">{title}</p>
        <p className="text-gray-500 text-sm mt-2">{description}</p>
      </div>
    </div>
  );
}
