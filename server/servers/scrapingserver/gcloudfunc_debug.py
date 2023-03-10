from flask import make_response, jsonify, Request
import traceback
import io
from contextlib import redirect_stdout
import builtins
import os


fileUrl = 'user_code.py'


def execute_code(code_to_run: str, stdin_value: str):
    try:
        # Write user's code to a file
        with open(fileUrl, 'w') as f:
            f.write(code_to_run)

        # Redirect stdout to a buffer
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        with redirect_stdout(stdout):
            # Execute the file, passing read_input() as the input function
            exec(open(fileUrl).read(), {'__builtins__': builtins},
                 {'input': input, 'print': print})

        return {"status": "success", "output": stdout.getvalue()}
    except Exception as e:
        tb = traceback.format_exc()
        return {"status": "error", "output": str(e), "traceback": tb}


code_to_run = "a = input()\nb = input()\nc = input()\nprint(a, b, c)"
stdin_value = "1\n2\n3"

result = execute_code(code_to_run, stdin_value)

print(result)

# Clean up the user code file
os.remove(fileUrl)
