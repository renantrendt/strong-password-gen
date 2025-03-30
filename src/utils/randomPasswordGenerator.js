import { getRandomChar, countSpecialChars } from './passwordUtils';

export const generateRandomPassword = (passwordLength, requirements, memorableSpecialChars, numbers, lowerLetters, upperLetters) => {
  // Initialize with minimum requirements
  let result = [];
  
  // Add required special characters
  for (let i = 0; i < requirements.specialChars; i++) {
    // Use only memorable special chars which is a proper array
    result.push(getRandomChar(memorableSpecialChars));
  }
  
  // Add required numbers
  for (let i = 0; i < requirements.numbers; i++) {
    result.push(getRandomChar(numbers));
  }
  
  // Add required capital letters
  for (let i = 0; i < requirements.capsLetters; i++) {
    result.push(getRandomChar(upperLetters));
  }
  
  // Fill the rest with lowercase letters
  const remainingChars = passwordLength - result.length;
  for (let i = 0; i < remainingChars; i++) {
    result.push(getRandomChar(lowerLetters));
  }
  
  // Shuffle the array
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  // Double-check that requirements are met after shuffling
  const password = result.join('');
  const specialCount = countSpecialChars(password, memorableSpecialChars);
  const numberCount = (password.match(/\d/g) || []).length;
  const capsCount = (password.match(/[A-Z]/g) || []).length;
  
  // If any requirements are not met, generate again
  if (specialCount < requirements.specialChars || 
      numberCount < requirements.numbers || 
      capsCount < requirements.capsLetters) {
    return generateRandomPassword(passwordLength, requirements, memorableSpecialChars, numbers, lowerLetters, upperLetters);
  }
  
  return password;
};
