# import json

# input_file = 'client/src/assets/olympiad/01.in'
# output_file = 'input.json'
# data = []

# with open(input_file, 'r') as f:
#     data = f.read().splitlines()

# with open(output_file, 'w') as f:
#     json.dump(data, f)

file1_path = 'client/public/assets/olympiad/01.out'
file2_path = 'client/public/assets/olympiad/01.out'

def files_are_equal(file1_path, file2_path):
    with open(file1_path, 'r') as file1, open(file2_path, 'r') as file2:
        file1_contents = file1.read()
        file2_contents = file2.read()

    return file1_contents == file2_contents

print(files_are_equal(file1_path, file2_path))

