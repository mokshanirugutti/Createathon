type InputType = string | string[] | number | number[];
type OutputType = string | string[] | number | number[] | boolean;

interface TestCase {
    input: InputType;
    expected_output: OutputType;
}

export interface Challenge {
    id: number;
    title: string;
    description: string;
    difficulty: 'beginner' | 'Intermediate' | 'Advanced'; 
    points: number;
    test_cases: TestCase[];
    category:string;
}

export interface Challenges extends Pick<Challenge, 'id' | 'title' | 'difficulty' | 'points' | 'category'> {}
