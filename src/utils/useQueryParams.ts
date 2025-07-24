// utils/useQueryParams.ts
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Memoized getter for array parameters
  const getParamArray = useCallback((key: string): string[] => {
    const param = searchParams.get(key);
    return param ? param.split(',') : [];
  }, [searchParams]);

  // Memoized setter for array parameters
  const setParamArray = useCallback((key: string, values: string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (values.length > 0) {
      newParams.set(key, values.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Memoized getter for single parameters
  const getParam = useCallback((key: string): string => {
    return searchParams.get(key) || '';
  }, [searchParams]);

  // Memoized setter for single parameters
  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // A helper to clear all parameters
  const clearAllParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    getParamArray,
    setParamArray,
    getParam,
    setParam,
    clearAllParams,
    // --- ADDED THIS LINE ---
    setSearchParams // Explicitly return setSearchParams
  };
};