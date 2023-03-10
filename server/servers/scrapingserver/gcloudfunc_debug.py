import traceback
import io
import builtins
import os
import sys


fileUrl = 'user_code.py'


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

        # Define a function to replace the input function in the imported module
        def new_input(prompt=None):
            return next(module.read_input)

        # Write user's code to a file
        with open(fileUrl, 'w') as f:
            f.write(code_to_run)

        # Redirect stdout to a buffer
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        sys.stdout = stdout

        # Execute the file
        module = __import__(os.path.splitext(fileUrl)[0])
        module.read_input = read_input()
        module.input = new_input

        module.main()

        sys.stdout = sys.__stdout__

        return {"status": "success", "output": stdout.getvalue().strip()}
    except Exception as e:
        tb = traceback.format_exc()
        return {"status": "error", "output": str(e), "traceback": tb}


code_to_run = "def main():\n\ta = input()\n\tb = input()\n\tc = input()\n\tprint(a, b, c)"
stdin_value = "1\n2\n3"

result = execute_code(code_to_run, stdin_value)

print(result)

# Clean up the user code file
os.remove(fileUrl)
