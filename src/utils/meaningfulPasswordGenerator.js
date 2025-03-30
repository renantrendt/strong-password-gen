import axios from 'axios';
import { memorableNumbers, memorableSpecialChars } from './passwordUtils';
import { themes, descriptiveAdjectives } from './wordCollections';

export const generateMeaningfulPassword = (words, memorableNumber, specialChar, theme = '') => {
  // Ensure we have at least one word
  if (!words || words.length === 0) {
    return null;
  }

  // Process the words to create a more coherent phrase
  let processedWords = words.map((word, index) => {
    // Make sure the word isn't too long
    let processedWord = word.length > 8 ? word.substring(0, 8) : word;
    
    // Capitalize the first word and some other words for readability
    // More randomized capitalization for variety
    if (index === 0 || Math.random() > 0.5) {
      return processedWord.charAt(0).toUpperCase() + processedWord.slice(1).toLowerCase();
    }
    return processedWord.toLowerCase();
  });

  // Create a meaningful password with a clear structure
  let result = '';
  
  // Randomly select from different formatting patterns for more variety
  const formatPattern = Math.floor(Math.random() * 5);
  
  if (processedWords.length >= 3) {
    switch (formatPattern) {
      case 0:
        // Format: Word1-Word2-Number-SpecialChar-Word3
        result += processedWords[0] + '-' + processedWords[1];
        result += memorableNumber;
        result += specialChar;
        result += processedWords[2];
        break;
      case 1:
        // Format: Word1-SpecialChar-Word2-Number-Word3
        result += processedWords[0] + specialChar;
        result += processedWords[1] + '-';
        result += memorableNumber;
        result += processedWords[2];
        break;
      case 2:
        // Format: Word1-Number-Word2-SpecialChar-Word3
        result += processedWords[0];
        result += memorableNumber;
        result += processedWords[1] + specialChar;
        result += processedWords[2];
        break;
      case 3:
        // Format: Word1-Word2-SpecialChar-Number-Word3
        result += processedWords[0] + '-';
        result += processedWords[1];
        result += specialChar;
        result += memorableNumber;
        result += processedWords[2];
        break;
      default:
        // Format: Number-Word1-SpecialChar-Word2-Word3
        result += memorableNumber;
        result += processedWords[0];
        result += specialChar;
        result += processedWords[1] + '-';
        result += processedWords[2];
    }
    
    // Add any additional words with dashes
    for (let i = 3; i < processedWords.length; i++) {
      result += '-' + processedWords[i];
    }
  } else if (processedWords.length === 2) {
    switch (formatPattern % 3) {
      case 0:
        // Format: Word1-Number-SpecialChar-Word2
        result += processedWords[0];
        result += memorableNumber;
        result += specialChar;
        result += processedWords[1];
        break;
      case 1:
        // Format: Word1-SpecialChar-Number-Word2
        result += processedWords[0];
        result += specialChar;
        result += memorableNumber;
        result += processedWords[1];
        break;
      default:
        // Format: Number-Word1-SpecialChar-Word2
        result += memorableNumber;
        result += processedWords[0];
        result += specialChar;
        result += processedWords[1];
    }
  } else {
    switch (formatPattern % 3) {
      case 0:
        // Format: Word-Number-SpecialChar
        result += processedWords[0];
        result += memorableNumber;
        result += specialChar;
        break;
      case 1:
        // Format: Word-SpecialChar-Number
        result += processedWords[0];
        result += specialChar;
        result += memorableNumber;
        break;
      default:
        // Format: Number-SpecialChar-Word
        result += memorableNumber;
        result += specialChar;
        result += processedWords[0];
    }
  }

  return result;
};

export const generateMeaningfulDicewarePassword = async (
  passwordLength, 
  requirements, 
  setIsLoading, 
  lastTheme, 
  setLastTheme, 
  lastAdjective, 
  setLastAdjective, 
  memorableSpecialChars, 
  generateRandomPassword
) => {
  setIsLoading(true);
  try {
    // Temporarily disable API approach since it's causing issues with passphrase text
    const useApi = false; // Set to false to always use our themed approach
    const wordsNeeded = Math.max(3, Math.min(4, Math.floor(passwordLength / 7)));
    
    if (false) { // This block is now disabled but kept for future reference
      try {
        // Add a timestamp parameter to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(`https://makemeapassword.ligos.net/api/v1/passphrase/plain`, {
          params: {
            wc: wordsNeeded,      // Number of words
            sp: 'y',             // Include spaces
            pc: 1,               // Number of passphrases
            maxCh: passwordLength, // Max characters
            ts: timestamp        // Prevent caching
          }
        });
        
        if (response.data) {
          // The API returns plain text with a passphrase
          // Remove any prefix like "A-passphrase" that might be in the response
          let passphrase = response.data.trim();
          
          // Remove any text that contains variations of 'passphrase'
          const passphraseRegex = /.*pass ?phr?a(s|z)e.*/i;
          if (passphraseRegex.test(passphrase)) {
            // If it contains passphrase text, use a completely different approach
            // Generate words using our themed approach instead
            return; // Skip the rest of the API handling
          }
          
          // Also remove any non-alphanumeric characters at the beginning
          passphrase = passphrase.replace(/^[^a-zA-Z0-9]+/, '');
          
          // Split into individual words
          const words = passphrase.split(' ');
          
          // Add a memorable number and special character
          const randomNumber = memorableNumbers[Math.floor(Math.random() * memorableNumbers.length)];
          const randomSpecial = memorableSpecialChars[Math.floor(Math.random() * memorableSpecialChars.length)];
          
          return generateMeaningfulPassword(words, randomNumber, randomSpecial, 'api');
        }
      } catch (apiError) {
        console.log('API error, using themed generation instead:', apiError);
        // Continue to themed generation if API fails
      }
    }
    
    // Use our themed generation approach
    // Select a random theme that's different from the last one
    const themeKeys = Object.keys(themes);
    let selectedTheme;
    do {
      selectedTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    } while (selectedTheme === lastTheme && themeKeys.length > 1);
    
    setLastTheme(selectedTheme);
    const themeWords = themes[selectedTheme];
    
    // Create a meaningful combination with a descriptive adjective
    let selectedWords = [];
    
    // Add a descriptive adjective that's different from the last one
    let adjective;
    do {
      adjective = descriptiveAdjectives[Math.floor(Math.random() * descriptiveAdjectives.length)];
    } while (adjective === lastAdjective && descriptiveAdjectives.length > 1);
    
    setLastAdjective(adjective);
    selectedWords.push(adjective);
    
    // Add 1-3 themed words (randomly choose how many to add more variety)
    const usedIndices = new Set();
    const themeWordsNeeded = Math.min(1 + Math.floor(Math.random() * 3), wordsNeeded - 1);
    
    for (let i = 0; i < themeWordsNeeded; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * themeWords.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      selectedWords.push(themeWords[randomIndex]);
    }
    
    // Add a memorable number
    const randomNumber = memorableNumbers[Math.floor(Math.random() * memorableNumbers.length)];
    
    // Add a special character
    const randomSpecial = memorableSpecialChars[Math.floor(Math.random() * memorableSpecialChars.length)];
    
    const result = generateMeaningfulPassword(selectedWords, randomNumber, randomSpecial, selectedTheme);
    return result;
  } catch (error) {
    console.error('All password generation methods failed:', error);
    return null;
  } finally {
    setIsLoading(false);
  }
};
