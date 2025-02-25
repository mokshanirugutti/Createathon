from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
from typing import Union

app = FastAPI()

class TestCase(BaseModel):
    input: Union[str,list]
    expected_output:  Union[str, int]

class ExecutionRequest(BaseModel):
    code: str
    test_cases: list[TestCase]

@app.post("/execute")
def execute_code(request: ExecutionRequest):
    user_code = request.code
    test_cases = request.test_cases
    # print(f'user code = {user_code}')
    # print(f'test cases = {test_cases}')
    results = []

    try:
        # Create a function scope for user code execution
        exec_globals = {}
        exec(user_code, exec_globals)

        if "Solution" not in exec_globals:
            raise Exception("class 'Solution' not defined in user code.")

        # Instantiate the Solution class
        solution_instance = exec_globals["Solution"]()
        
        
        # Ensure the 'solve' method exists
        if not hasattr(solution_instance, "solve"):
            raise Exception("Method 'solve' not found in 'Solution' class.")
        
        solve_method = getattr(solution_instance, "solve")
          
        for test_case in test_cases:
            try:
                start_time = time.time()
                output = solve_method(test_case.input) # Call user's solve method
                execution_time = time.time() - start_time

                results.append({
                    "input": test_case.input,
                    "expected_output": test_case.expected_output,
                    "actual_output": output,
                    "passed": output == test_case.expected_output,
                    "execution_time": execution_time
                })
            except Exception as e:
                results.append({
                    "input": test_case.input,
                    "expected_output": test_case.expected_output,
                    "actual_output": str(e),
                    "passed": False,
                    "execution_time": None
                })
        
        return {"status": "passed" if all(r["passed"] for r in results) else "failed", "results": results}

    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))