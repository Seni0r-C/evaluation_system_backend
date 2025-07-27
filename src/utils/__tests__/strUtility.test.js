const { capitalize } = require('../strUtility');

describe('capitalize', () => {
  test('should capitalize the first letter of each word and lowercase the rest', () => {
    expect(capitalize('hello world')).toBe('Hello World');
    expect(capitalize('jOHN dOE')).toBe('John Doe');
    expect(capitalize('singleword')).toBe('Singleword');
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe(''); // Assuming it handles null gracefully
    expect(capitalize(undefined)).toBe(''); // Assuming it handles undefined gracefully
  });
});