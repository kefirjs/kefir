# Use the Luhn algorithm to validate a numeric identifier, such as credit card
# numbers, national insurance numbers, etc.
# See: http://en.wikipedia.org/wiki/Luhn_algorithm

is_valid_identifier = (identifier) ->

  sum = 0
  alt = false

  for c in identifier by -1

    # Get the next digit.
    num = parseInt c, 10

    # If it's not a valid number, abort.
    return false if isNaN num

    # If it's an alternate number...
    if alt
      num *= 2
      num = (num % 10) + 1 if num > 9

    # Flip the alternate bit.
    alt = !alt

    # Add to the rest of the sum.
    sum += num

  # Determine if it's valid.
  sum % 10 is 0


# Tests.
console.log is_valid_identifier("49927398716")      is true
console.log is_valid_identifier("4408041234567893") is true
console.log is_valid_identifier("4408041234567890") is false
