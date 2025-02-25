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


export interface User {
    id: string;
    username: string;
    email: string;
    
  }
  
  export interface UserContextType {
    user: User | null; 
    token: string | null;
    register: (username: string, password: string, email: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>; 
    logout: () => void;
  }

