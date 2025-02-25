import { Challenge } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";


const useChallenge = (id: number) => {
    const URL = import.meta.env.VITE_BACKEND_URL;
    const [challenge, setChallenge] = useState<Challenge>({} as Challenge);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                
                
                const respose = await axios.get(`${URL}/challenges/${id}`);
                console.log(respose)
                setChallenge(respose.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching challenges:', error);
                setError('Error fetching challenges' + error);
            }
        };

        fetchChallenges();
    }, []);

    return { challenge, loading, error };

}

export default useChallenge