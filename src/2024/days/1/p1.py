import time

# Record the start time
start_time = time.time()

with open('./input.txt', 'r') as file:
    file_contents = file.read()

lines = file_contents.split('\n')

lefts = []
rights = []

for line in lines:
    left, right = line.split('   ')
    lefts.append(left)
    rights.append(right)

lefts = sorted([int(left) for left in lefts])
rights = sorted([int(right) for right in rights])

answer = 0

for index, left in enumerate(lefts):
    differenceInPair = abs(left - rights[index])
    answer += differenceInPair

print(answer)

# Record the end time
end_time = time.time()

# Calculate and print the total execution time
execution_time = end_time - start_time
print(f"Total execution time: {execution_time} seconds")
