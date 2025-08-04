import { useState, useEffect, useCallback } from "react";

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export function useDebouncedSearch(
  initialValue: string = "",
  options: UseDebouncedSearchOptions = {}
) {
  const { delay = 300, minLength = 2 } = options;

  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setDebouncedSearchTerm("");
      setIsTyping(false);
      return;
    }

    if (searchTerm.length < minLength) {
      setDebouncedSearchTerm("");
      setIsTyping(true);
      return;
    }

    setIsTyping(true);

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsTyping(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay, minLength]);

  const updateSearchTerm = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsTyping(false);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    isTyping,
    updateSearchTerm,
    clearSearch,
    hasValidSearch: debouncedSearchTerm.length >= minLength,
  };
}
