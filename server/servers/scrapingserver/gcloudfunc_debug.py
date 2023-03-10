import traceback
import io
from contextlib import redirect_stdout
import builtins
import os


fileUrl = 'user_code.py'


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

        # Redirect stdout to a buffer
        stdout = io.StringIO()  # Create a StringIO object to capture stdout
        with redirect_stdout(stdout):
            # Execute the file, passing read_input() as the input function
            exec(open(fileUrl).read(), {'__builtins__': builtins},
                 {'input': read_input, 'print': print})

        # Parse the output and format it as a single string
        output_lines = stdout.getvalue().split('\n')
        output_lines = [line.strip() for line in output_lines if line.strip()]
        output_str = ' '.join(output_lines)

        return {"status": "success", "output": output_str}
    except Exception as e:
        tb = traceback.format_exc()
        return {"status": "error", "output": str(e), "traceback": tb}


code_to_run = "a = input()\nb = input()\nc = input()\nprint(a, b, c)"
stdin_value = "1\n2\n3"

result = execute_code(code_to_run, stdin_value)

print(result)

# Clean up the user code file
os.remove(fileUrl)
