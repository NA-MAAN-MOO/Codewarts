from flask import make_response, jsonify, Request
import traceback
import io
from contextlib import redirect_stdout
import builtins
import sys
import os
import resource
import time


def execute_code(code_to_run: str, stdin_value: str):
    try:
        # Define a function to read input
        def read_input():
            if stdin_value is not None:
                return stdin_value
            elif sys.stdin.isatty():
                # If running in a terminal, prompt the user for input
                return input()
            else:
                # Otherwise, read input from stdin
                return sys.stdin.readline().rstrip('\n')

        # Write user's code to a file
        with open('/tmp/user_code.py', 'w') as f:
            f.write(code_to_run)

        # Start tracking the time and memory usage
        start_time = time.monotonic()
        start_mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

        # Redirect stdout to a buffer
        output_buf = io.StringIO()
        for line in stdin_value.split('\n'):
            stdout = io.StringIO()
            with redirect_stdout(stdout):
                exec(open('/tmp/user_code.py').read(), {'__builtins__': builtins},
                     {'input': lambda: line.strip(), 'print': lambda *args, **kwargs: print(*args, **kwargs, file=output_buf)})
            output_buf.write('\n')

        # End tracking the time and memory usage
        end_time = time.monotonic()
        end_mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

        # Calculate the time and memory usage
        elapsed_time = (end_time - start_time) * \
            1000  # Convert to milliseconds
        elapsed_mem = end_mem - start_mem  # Return in KB

        # Parse the output and format it as a single string
        output_str = output_buf.getvalue().strip()

        return {"status": "success", "output": output_str,
                "time": elapsed_time, "memory": elapsed_mem}
    except Exception as e:
        tb = traceback.format_exc()
        return {"status": "error", "output": str(e), "traceback": tb}


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
        resp = make_response(
            jsonify({"status": "success",
                     "output": result["output"],
                     "time": result["time"],
                     "memory": result["memory"]
                     }), 200)
    else:
        resp = make_response(
            jsonify({"status": "traceback",
                     "error": result["output"],
                     "output": result["traceback"]}), 500)

    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    # Clean up the user code file
    os.remove('/tmp/user_code.py')

    return resp
