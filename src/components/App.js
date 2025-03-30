import { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import PasswordDisplay from './PasswordDisplay';
import PasswordControls from './PasswordControls';
import PasswordRequirements from './PasswordRequirements';

// Utilities
import { memorableSpecialChars } from '../utils/passwordUtils';
import { generateRandomPassword } from '../utils/randomPasswordGenerator';
import { generateMeaningfulDicewarePassword } from '../utils/meaningfulPasswordGenerator';

// Styles
import '../styles/App.css';

function App() {
  const [passwordLength, setPasswordLength] = useState(12);
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('meaningful'); // 'meaningful' or 'random'
  const [requirements, setRequirements] = useState({
    specialChars: 3,
    numbers: 3,
    capsLetters: 2
  });
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [lastTheme, setLastTheme] = useState('');
  const [lastAdjective, setLastAdjective] = useState('');
  
  // Different special character sets for phone and computer modes
  const computerSpecialChars = '£∞¢≠∑†πΩ';
  const phoneSpecialChars = '!@#$%^&*()_-+=<>?/{}[]|';
  // Use the appropriate set based on current mode
  const specialChars = isPhoneMode ? phoneSpecialChars : computerSpecialChars;
  const numbers = '0123456789';
  const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Initialize with a password on component mount
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update requirements when length changes
  useEffect(() => {
    // Scale requirements based on password length
    const specialReq = Math.max(3, Math.floor(passwordLength * 0.15));
    const numberReq = Math.max(3, Math.floor(passwordLength * 0.15));
    const capsReq = Math.max(2, Math.floor(passwordLength * 0.10));
    
    setRequirements({
      specialChars: specialReq,
      numbers: numberReq,
      capsLetters: capsReq
    });
    
    // Generate new password when requirements change
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordLength, passwordType]);

  // Function to ensure password meets requirements
  const ensurePasswordRequirements = (pwd) => {
    // Count current character types
    let specialCount = (pwd.match(/[!@#$%^&*()_\-+=<>?/{}[\]|]/g) || []).length;
    let numberCount = (pwd.match(/\d/g) || []).length;
    let capsCount = (pwd.match(/[A-Z]/g) || []).length;
    
    // Force capitalize more letters if needed to meet the requirement
    if (capsCount < requirements.capsLetters) {
      // Find lowercase letters that we can capitalize
      const lowerLettersInResult = pwd.match(/[a-z]/g) || [];
      
      // Calculate how many more capital letters we need
      const needMoreCaps = requirements.capsLetters - capsCount;
      
      // Only try to capitalize up to the number of available lowercase letters
      const canCapitalize = Math.min(needMoreCaps, lowerLettersInResult.length);
      
      if (canCapitalize > 0) {
        // Create a copy of the result to modify
        let modifiedResult = pwd;
        
        // Keep track of positions we've already capitalized
        const capitalizedPositions = new Set();
        
        // Try to capitalize random lowercase letters
        for (let i = 0; i < canCapitalize; i++) {
          // Find all lowercase letter positions that haven't been capitalized yet
          const positions = [];
          for (let j = 0; j < modifiedResult.length; j++) {
            if (/[a-z]/.test(modifiedResult[j]) && !capitalizedPositions.has(j)) {
              positions.push(j);
            }
          }
          
          if (positions.length > 0) {
            // Randomly select a position to capitalize
            const randomIndex = Math.floor(Math.random() * positions.length);
            const posToCapitalize = positions[randomIndex];
            
            // Capitalize the letter at that position
            modifiedResult = 
              modifiedResult.substring(0, posToCapitalize) + 
              modifiedResult[posToCapitalize].toUpperCase() + 
              modifiedResult.substring(posToCapitalize + 1);
            
            // Mark this position as capitalized
            capitalizedPositions.add(posToCapitalize);
          }
        }
        
        // Update the result
        pwd = modifiedResult;
        capsCount = (pwd.match(/[A-Z]/g) || []).length;
      }
    }
    
    // Make sure we always have at least one special character
    if (specialCount === 0) {
      // Add a memorable special character if none exists
      pwd += memorableSpecialChars[Math.floor(Math.random() * memorableSpecialChars.length)];
      specialCount++;
    }
    
    // Add any missing special chars, numbers, or caps as needed
    let suffix = '';
    for (let i = specialCount; i < requirements.specialChars; i++) {
      suffix += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    }
    for (let i = numberCount; i < requirements.numbers; i++) {
      suffix += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    for (let i = capsCount; i < requirements.capsLetters; i++) {
      suffix += upperLetters.charAt(Math.floor(Math.random() * upperLetters.length));
    }
    
    // If we need to adjust the password to desired length
    let finalPassword = pwd + suffix;
    if (finalPassword.length > passwordLength) {
      finalPassword = finalPassword.slice(0, passwordLength);
    }
    
    return finalPassword;
  };

  const generatePassword = async () => {
    if (passwordType === 'meaningful') {
      try {
        const meaningfulPassword = await generateMeaningfulDicewarePassword(
          passwordLength,
          requirements,
          setIsLoading,
          lastTheme,
          setLastTheme,
          lastAdjective,
          setLastAdjective,
          memorableSpecialChars,
          () => generateRandomPassword(passwordLength, requirements, memorableSpecialChars, numbers, lowerLetters, upperLetters)
        );
        
        if (meaningfulPassword) {
          const finalPassword = ensurePasswordRequirements(meaningfulPassword);
          setPassword(finalPassword);
        } else {
          // Fall back to random password if meaningful generation fails
          const randomPassword = generateRandomPassword(passwordLength, requirements, memorableSpecialChars, numbers, lowerLetters, upperLetters);
          setPassword(randomPassword);
        }
      } catch (error) {
        console.error('Error generating meaningful password:', error);
        // Fall back to random password
        const randomPassword = generateRandomPassword(passwordLength, requirements, memorableSpecialChars, numbers, lowerLetters, upperLetters);
        setPassword(randomPassword);
      }
    } else {
      const randomPassword = generateRandomPassword(passwordLength, requirements, memorableSpecialChars, numbers, lowerLetters, upperLetters);
      setPassword(randomPassword);
    }
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePhoneMode = () => {
    setIsPhoneMode(!isPhoneMode);
    // Regenerate password with new special characters
    generatePassword();
  };
  
  return (
    <div className="App">
      <button 
        onClick={togglePhoneMode} 
        className="mode-toggle"
      >
        {isPhoneMode ? 'Computer Version' : 'Phone Version'}
      </button>
      <div className="container">
        <h1>Strong Password Generator</h1>
        
        <PasswordDisplay 
          password={password} 
          isLoading={isLoading} 
          copied={copied} 
          copyToClipboard={copyToClipboard} 
        />
        
        <PasswordControls 
          passwordType={passwordType} 
          setPasswordType={setPasswordType} 
          passwordLength={passwordLength} 
          setPasswordLength={setPasswordLength} 
          generatePassword={generatePassword} 
          isLoading={isLoading} 
        />
        
        <PasswordRequirements 
          requirements={requirements} 
          setRequirements={setRequirements} 
        />
        
        <div className="api-credit">
          <small>Powered by bernardoserrano.com©</small>
        </div>
      </div>
    </div>
  );
}

export default App;
