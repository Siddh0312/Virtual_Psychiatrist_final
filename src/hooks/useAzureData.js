import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAzureData = (endpoint, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual Azure API endpoints and authentication
  const azureBaseUrl = process.env.REACT_APP_AZURE_API_URL;
  const azureApiKey = process.env.REACT_APP_AZURE_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In production, replace with actual Azure endpoints
        const response = await axios.get(`${azureBaseUrl}/${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${azureApiKey}`
          }
        });
        
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data from Azure:', err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [endpoint, azureBaseUrl, azureApiKey]);

  const updateData = async (newData) => {
    try {
      // In production, replace with actual Azure endpoints
      await axios.post(`${azureBaseUrl}/${endpoint}`, newData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${azureApiKey}`
        }
      });
      
      setData(newData);
      return true;
    } catch (err) {
      console.error('Error updating data in Azure:', err);
      setError('Failed to update data');
      return false;
    }
  };

  return { data, loading, error, updateData };
};