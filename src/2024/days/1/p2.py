import time
from collections import defaultdict

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

lefts = [int(left) for left in lefts]
rights = [int(right) for right in rights]

rightsCount = defaultdict(int)

for right in rights:
    rightsCount[right] += 1 

answer = 0

for left in lefts:
    similarityScore = left * rightsCount[left]
    answer += similarityScore

print(answer)

# Record the end time
end_time = time.time()

# Calculate and print the total execution time
execution_time = end_time - start_time
print(f"Total execution time: {execution_time} seconds")
