def filter_even(nums):
    result = []
    for i in nums:
        if i % 2 == 0:
            result.append(i)
    return result
print(filter_even([1, 2, 3, 4]))        