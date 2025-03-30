import React from 'react';
import '../styles/PasswordRequirements.css';

const PasswordRequirements = ({ requirements, setRequirements }) => {
  const handleRequirementChange = (key, value) => {
    setRequirements({...requirements, [key]: value});
  };

  return (
    <div className="requirements">
      <h3>Password Requirements:</h3>
      <div className="requirements-controls">
        <div className="requirement-control">
          <div className="requirement-row">
            <label>Special Characters</label>
            <input 
              type="number" 
              min="0" 
              max="5" 
              value={requirements.specialChars} 
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                handleRequirementChange('specialChars', value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur(); // Just remove focus from the input
                }
              }}
              className="number-input"
            />
          </div>
        </div>
        <div className="requirement-control">
          <div className="requirement-row">
            <label>Numbers</label>
            <input 
              type="number" 
              min="0" 
              max="5" 
              value={requirements.numbers} 
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                handleRequirementChange('numbers', value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur(); // Just remove focus from the input
                }
              }}
              className="number-input"
            />
          </div>
        </div>
        <div className="requirement-control">
          <div className="requirement-row">
            <label>Capital Letters</label>
            <input 
              type="number" 
              min="0" 
              max="5" 
              value={requirements.capsLetters} 
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                handleRequirementChange('capsLetters', value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur(); // Just remove focus from the input
                }
              }}
              className="number-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;
