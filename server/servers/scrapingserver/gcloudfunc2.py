from flask import make_response, jsonify, Request
import traceback
import io
import builtins
import sys
import resource
import time
import types


def execute_code(code_to_run: str, stdin_value: str):
    try:
        # Define a function to read input
        def read_input():
            if stdin_value is not None:
                input_lines = stdin_value.split('\n')
                for line in input_lines:
                    yield line.strip()
            elif builtins.input == input:
                # If running in a terminal, prompt the user for input
                while True:
                    yield input()
            else:
                # Otherwise, read input from stdin
                while True:
                    yield input().rstrip('\n')

        # Redirect stdout to a buffer
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        sys.stdout = stdout

        # Start tracking the time and memory usage
        start_time = time.monotonic()
        start_mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

        # Execute the code
        module = types.ModuleType('__main__')
        module.read_input = read_input()
        module.input = lambda prompt=None: next(module.read_input)

        exec(code_to_run, module.__dict__)

        sys.stdout = sys.__stdout__

        # End tracking the time and memory usage
        end_time = time.monotonic()
        end_mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

        # Calculate the time and memory usage
        elapsed_time = (end_time - start_time) * \
            1000  # Convert to milliseconds
        elapsed_mem = end_mem - start_mem  # Return in KB

        return {"status": "success", "output": stdout.getvalue().strip(),
                "time": elapsed_time, "memory": elapsed_mem}
    except Exception as e:
        tb = traceback.format_exc()
        return {"status": "traceback", "output": tb}


def hello_world(request: Request):
    if request.method == 'POST':
        req_body = request.get_json()
        code_to_run = req_body["code"]
        stdin_value = req_body['stdin']
    else:
        code_to_run = ""
        stdin_value = ""

    result = execute_code(code_to_run, stdin_value)

    if result["status"] == "success":
        resp_data = {"status": "success",
                     "output": result["output"],
                     "time": result["time"],
                     "memory": result["memory"]
                     }
        status_code = 200
    else:
        resp_data = {"status": "traceback",
                     "output": result["output"]}
        status_code = 500

    resp = make_response(jsonify(resp_data), status_code)

    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return resp
