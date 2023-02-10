const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of liberodev', () => {
  const result = palindrome('liberodev')

  expect(result).toBe('vedorebil')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
