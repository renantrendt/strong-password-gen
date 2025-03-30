// Password utility functions

// Common English words that are easy to remember but not too common
export const commonWords = [
  // Nouns
  'apple', 'banana', 'castle', 'diamond', 'eagle', 'forest', 'garden', 'harbor', 'island', 'jungle',
  'kitchen', 'lemon', 'mountain', 'notebook', 'ocean', 'palace', 'river', 'sunset', 'tiger', 'umbrella',
  'village', 'window', 'xylophone', 'yacht', 'zebra', 'airplane', 'butterfly', 'camera', 'dolphin', 'elephant',
  'flower', 'guitar', 'hamburger', 'iceberg', 'jacket', 'kangaroo', 'lighthouse', 'mushroom', 'necklace', 'octopus',
  'penguin', 'rainbow', 'strawberry', 'telescope', 'unicorn', 'volcano', 'waterfall', 'anchor', 'basket', 'candle', 'batata', 'skibidi',
  
  // Adjectives
  'happy', 'brave', 'calm', 'dark', 'eager', 'fancy', 'giant', 'hidden', 'icy', 'jolly',
  'kind', 'little', 'mighty', 'noble', 'orange', 'pretty', 'quiet', 'rapid', 'silent', 'tiny',
  'useful', 'vast', 'warm', 'yellow', 'zesty', 'ancient', 'bright', 'clever', 'distant', 'elegant',
  'famous', 'gentle', 'honest', 'intense', 'joyful', 'keen', 'lucky', 'magical', 'narrow', 'oval',
  'peaceful', 'quick', 'rare', 'smooth', 'tall', 'unique', 'vivid', 'wild', 'young', 'blue', 'alpha', 'rizzlergyat',
  
  // Verbs
  'jump', 'swim', 'run', 'dance', 'sing', 'laugh', 'dream', 'think', 'grow', 'fly',
  'build', 'create', 'draw', 'eat', 'find', 'give', 'help', 'join', 'know', 'learn',
  'make', 'play', 'read', 'sleep', 'talk', 'walk', 'write', 'begin', 'choose', 'drive','play', 'sigma'
];

// List of memorable numbers (years, famous numbers, etc.)
export const memorableNumbers = ['42', '007', '100', '99','665+1', '777', '1984', '2000', '1234', '101', '404', '360', '180', '90', '365', '24', '60'];

// Characters sets
export const memorableSpecialChars = ['!', '@', '#', '$', '%', '*', '-', '+', '=', '?'];

// Helper function to get a random character from a character set
export const getRandomChar = (charSet) => {
  // Handle both string and array inputs
  if (Array.isArray(charSet)) {
    return charSet[Math.floor(Math.random() * charSet.length)];
  } else {
    return charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
};

// Helper function to count special characters in a string
export const countSpecialChars = (str, specialChars) => {
  let count = 0;
  
  // Count memorable special characters
  for (const char of specialChars) {
    count += (str.split(char).length - 1);
  }
  
  return count;
};

// Calculate password strength (0-100)
export const calculatePasswordStrength = (pwd, memorableSpecialChars) => {
  if (!pwd) return 0;
  
  let score = 0;
  
  // Length contribution (up to 40 points)
  score += Math.min(40, pwd.length * 2);
  
  // Character variety contribution
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const specialCount = countSpecialChars(pwd, memorableSpecialChars);
  
  if (hasLower) score += 10;
  if (hasUpper) score += 15;
  if (hasDigit) score += 15;
  if (specialCount > 0) score += Math.min(20, specialCount * 5);
  
  return Math.min(100, score);
};

// Helper function to get strength category
export const getStrengthCategory = (strength) => {
  if (strength < 30) return 'weak';
  if (strength < 60) return 'fair';
  if (strength < 80) return 'good';
  return 'strong';
};
