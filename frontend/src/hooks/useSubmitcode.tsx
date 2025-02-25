import axios from 'axios';

const useSubmitCode = () => {
    const URL = import.meta.env.VITE_BACKEND_URL;

    return async (code: string, challengeId: number, authToken: string) => {
        try {
            const response = await axios.post(
                `${URL}/execute-submission/`,
                {
                    challenge_id: challengeId,
                    code: code,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Submission error:", error);
            throw new Error("Submission failed");
        }
    };
};

export default useSubmitCode;
