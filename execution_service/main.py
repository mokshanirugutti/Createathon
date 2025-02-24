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

        if "solution" not in exec_globals:
            raise Exception("Function 'solution' not defined in user code.")

        solution_function = exec_globals["solution"]

        for test_case in test_cases:
            try:
                start_time = time.time()
                output = solution_function(test_case.input)  # Call user's function
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