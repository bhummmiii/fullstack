/**
 * useApi.js – Custom React hooks for API data-fetching and mutations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '../services/api';

// ─── useApi ───────────────────────────────────────────────────────────────────

export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRef.current();
      setData(response.data ?? null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// ─── useMutation ──────────────────────────────────────────────────────────────

export function useMutation(mutationFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutationRef = useRef(mutationFn);
  mutationRef.current = mutationFn;

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mutationRef.current(variables);
      const result = response.data ?? null;
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, data, loading, error, reset };
}
