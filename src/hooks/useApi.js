// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import api from '@/api/api';

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, config = {}) => {
    try {
      setLoading(true);
      const response = await api(endpoint, config);
      setData(response.data);
      return response.data;
    } catch (err) {      
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    } 
  }, []);

  return { data, loading, error, fetchData };
};