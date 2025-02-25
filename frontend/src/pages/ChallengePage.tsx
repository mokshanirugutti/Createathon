import { Badge } from '@/components/ui/badge';
import useChallenge from '@/hooks/useChallenege';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import useRunCode from '@/hooks/useRunCode';
import useSubmitCode from '@/hooks/useSubmitcode';

const ChallengePage: React.FC = () => {
    const { id } = useParams();
    const [code, setCode] = useState<string>(
        `class Solution:\n    def solve(self, data):\n        pass`
    );
    const [results, setResults] = useState<string>('');
    const { challenge, loading, error } = useChallenge(Number(id));
    const runCode = useRunCode();
    const submitCode = useSubmitCode();
    const authToken = localStorage.getItem('token');


    const handleRun = async () => {
        if (!challenge) return;
        setResults('Running...');
        try {
            const batchedTestCases = [];
            for (let i = 0; i < challenge.test_cases.length; i += 2) {
                batchedTestCases.push(challenge.test_cases.slice(i, i + 2));
            }

            const testCaseResults = await Promise.all(
                batchedTestCases.map(async (batch) => {
                    const testInputs = batch.map(tc => JSON.stringify(tc.input));
                    const formattedCode = `\n${code}\n\nsol = Solution()\nprint([sol.solve(${testInputs[0]}), sol.solve(${testInputs[1]})])`;
                    const response = await runCode(formattedCode);
                    const outputs = JSON.parse(response);
                    return batch.map((testCase, index) => 
                        `Input: ${JSON.stringify(testCase.input)}\nExpected: ${testCase.expected_output}\nOutput: ${outputs[index]}\n---`
                    ).join('\n');
                })
            );
            setResults(testCaseResults.join('\n'));
        } catch (err) {
            setResults('Error running the code.');
        }
    };


    const handleSubmit = async () => {
        if (!authToken) {
            alert('Please log in to submit your solution.');
            return;
        }
        try {
            const response = await submitCode(code, challenge.id, authToken);
            setResults(JSON.stringify(response.results, null, 2));
        } catch (error) {
            setResults('Submission failed. Please try again.');
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className='pagePadding py-10 grid grid-cols-1 md:grid-cols-2 h-[30rem]'>
            <div>
                <h1 className='text-3xl font-semibold py-3'>{challenge.title}</h1>
                <div className='flex gap-2 capitalize mt-1 mb-3'>
                    <Badge variant="secondary" className={`tracking-wider 
                        ${challenge.difficulty === 'beginner' ? 'text-green-500' : 
                        challenge.difficulty === 'Intermediate' ? 'text-orange-500' : 'text-red-500'}`}
                    >
                        {challenge.difficulty}
                    </Badge>
                    <Badge variant="secondary">{challenge.category}</Badge>
                    <Badge variant="secondary">Points: {challenge.points}</Badge>
                </div>
                <p className='text-base tracking-wide'>{challenge.description}</p>
                <div className='mt-5'>
                    <ul>
                        {challenge.test_cases.map((testCase, index) => (
                            <React.Fragment key={index}>
                                <span className='my-2'>Example {index + 1}</span>
                                <li className='mb-2 pl-3'>
                                    Input : {JSON.stringify(testCase.input)} <br />
                                    Output : {testCase.expected_output}
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
                <div className='w-3/4 h-32 rounded-md border px-3 py-1 overflow-auto mt-4'>
                    <strong>Results:</strong>
                    <pre className='whitespace-pre-wrap'>{results}</pre>
                </div>
            </div>
            <div className='h-full w-full'>
                <Editor height="28rem" theme='vs-dark' defaultLanguage="python" value={code} onChange={(value) => setCode(value!)} />
                <div className='flex gap-2 my-2'>
                        
                    <Button variant="outline" onClick={handleSubmit} disabled={!authToken}>{authToken ? "Submit" : "Login to submit"}</Button>
                    <Button variant="secondary" onClick={handleRun}>Run</Button>
                </div>
            </div>
        </div>
    );
}

export default ChallengePage;
