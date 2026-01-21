import axios from 'axios';
import { useState, useEffect } from 'react';

// API bazasi
const API_BASE_URL = 'http://app.dentago.uz/api/public';

function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctors`);
        setDoctors(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('API xatosi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
}
