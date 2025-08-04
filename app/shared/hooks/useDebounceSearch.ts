import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router";

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export function useDebouncedSearch(options: UseDebouncedSearchOptions = {}) {
  const { delay = 300, minLength = 2 } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedTerm, setDebouncedTerm] = useState(
    searchParams.get("search") || ""
  );
  const [isTyping, setIsTyping] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setDebouncedTerm(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!searchTerm.trim()) {
      setDebouncedTerm("");
      setIsTyping(false);

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("search");
        return newParams;
      });
      return;
    }

    if (searchTerm.length < minLength) {
      setDebouncedTerm("");
      setIsTyping(true);
      return;
    }

    setIsTyping(true);

    timeoutRef.current = setTimeout(() => {
      const trimmed = searchTerm.trim();
      setDebouncedTerm(trimmed);
      setIsTyping(false);

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("search", trimmed);
        return newParams;
      });
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, delay, minLength, setSearchParams]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    setIsTyping(false);

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      return newParams;
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [setSearchParams]);

  return {
    searchTerm,
    debouncedTerm,
    isTyping,
    hasValidSearch: debouncedTerm.length >= minLength,
    updateSearch,
    clearSearch,
  };
}
