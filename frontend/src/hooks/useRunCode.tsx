import axios from 'axios';

const useRunCode = () => {
    return async (code: string) => {
        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: "python",
                version: "3.10.0",
                files: [{ content: code }],
            });
            return response.data.run.output.trim();
        } catch (error) {
            return "Execution error";
        }
    };
};

export default useRunCode;
