from flask import make_response, jsonify, Request
import traceback
import io
from contextlib import redirect_stdout
import builtins
import sys
import os


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

        # Redirect stdout to a buffer
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        with redirect_stdout(stdout):
            # Execute the file, passing read_input() as the input function
            exec(open('/tmp/user_code.py').read(), {'__builtins__': builtins},
                 {'input': read_input})

        return {"status": "success", "output": stdout.getvalue()}
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
                     "output": result["output"]}), 200)
    else:
        resp = make_response(
            jsonify({"status": "traceback",
                     "error": result["output"],
                     "traceback": result["traceback"]}), 500)

    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    # Clean up the user code file
    os.remove('/tmp/user_code.py')

    return resp
