import axios from "axios";
import { useEffect, useState } from "react";

export interface Submission {
  id: number;
  code: string;
  result: {
    status: string;
    results?: Array<{
      input: any[];
      passed: boolean;
      actual_output: any;
      execution_time: number;
      expected_output: any;
    }>;
    detail?: string;
  };
  status: string;
  submitted_at: string;
  user: number;
  challenge: number;
}

const useSubmissions = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const getSubmissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Submission[]>(`${URL}/submissions/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSubmissions(response.data);
      } catch (err) {
        setError("Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    getSubmissions();
  }, [URL, authToken]);

  return { submissions, loading, error };
};

export default useSubmissions;