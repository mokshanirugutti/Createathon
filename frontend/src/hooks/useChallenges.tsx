import axios from 'axios'
import { useEffect, useState } from 'react'
import { Challenge } from '@/types'

const useChallenges = () => {
    const URL = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState<boolean>(true)
    const [Challenges, setChallenges] = useState<Challenge[]>()
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const getChallenges =  async () => {
        try {
            const response = await axios.get(`${URL}/challenges/`)
            console.log('response data')
            console.log(response.data)
            setChallenges(response.data)
            setLoading(false);
        } catch (error : any) {
            console.log(error)
            setError(error)

        }
      }
      
      getChallenges();

    }, [])
    
    return  { loading, Challenges, error }

}


export default useChallenges