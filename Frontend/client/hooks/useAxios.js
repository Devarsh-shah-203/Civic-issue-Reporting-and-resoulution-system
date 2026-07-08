"use client";

import { useCallback, useState } from "react";
import api from "../services/axios";

// Thin convenience wrapper around the shared axios instance for
// components that will eventually call the real backend directly.
export function useAxios() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
