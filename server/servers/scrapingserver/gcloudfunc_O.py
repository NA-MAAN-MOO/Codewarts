from flask import make_response, jsonify, Request
import traceback
import io
from contextlib import redirect_stdout
import builtins
import sys
import os
import resource
import time

fileUrl = '/tmp/user_code.py'


def execute_code(code_to_run: str, stdin_value: str):
    try:
        inputs = []
        # Define a function to read input

        def read_input():
            nonlocal inputs
            if stdin_value is not None:
                input_value = stdin_value.split('\n')[len(inputs)]
                inputs.append(input_value)
                return input_value
            elif sys.stdin.isatty():
                # If running in a terminal, prompt the user for input
                input_value = input()
                inputs.append(input_value)
                return input_value
            else:
                # Otherwise, read input from stdin
                input_value = sys.stdin.readline().rstrip('\n')
                inputs.append(input_value)
                return input_value

        # Write user's code to a file
        with open(fileUrl, 'w') as f:
            f.write(code_to_run)

        # Start tracking the time and memory usage
        start_time = time.monotonic()
        start_mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

        # Redirect stdout to a buffer
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        with redirect_stdout(stdout):
            # Execute the file, passing read_input() as the input function
            exec(open(fileUrl).read(), {'__builtins__': builtins},
                 {'input': read_input, 'print': print})

        # End tracking the time and memory usage
        end_time = time.monotonic()
        end_mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

        # Calculate the time and memory usage
        elapsed_time = (end_time - start_time) * \
            1000  # Convert to milliseconds
        elapsed_mem = end_mem - start_mem  # Return in KB

        # Parse the output and format it as a single string
        output_lines = stdout.getvalue().split('\n')
        output_lines = [line.strip() for line in output_lines if line.strip()]
        output_str = ' '.join(output_lines)

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
    os.remove(fileUrl)

    return resp
