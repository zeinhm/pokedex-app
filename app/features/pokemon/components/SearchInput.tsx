import { useState, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search Pokemon by name...",
  isLoading = false,
  className,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onClear();
  }, [onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [handleClear]
  );

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto",
        "bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50",
        "transition-all duration-200",
        isFocused && "border-purple-500/50 shadow-lg shadow-purple-500/10",
        className
      )}
    >
      <div className="relative flex items-center">
        <Search
          className={cn(
            "absolute left-3 w-4 h-4 transition-colors duration-200",
            isFocused ? "text-purple-400" : "text-gray-400"
          )}
        />

        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 bg-transparent border-none",
            "text-white placeholder:text-gray-400",
            "focus:ring-0 focus:border-none focus:outline-none"
          )}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          )}

          {value && !isLoading && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {value && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-400 px-3 py-1">
          {isLoading ? "Searching..." : `Searching for "${value}"`}
        </div>
      )}
    </div>
  );
}
