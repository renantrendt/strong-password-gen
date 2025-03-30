import React from 'react';
import '../styles/PasswordControls.css';

const PasswordControls = ({ 
  passwordType, 
  setPasswordType, 
  passwordLength, 
  setPasswordLength, 
  generatePassword, 
  isLoading 
}) => {
  return (
    <div className="controls">
      <div className="type-control">
        <label>Password Type:</label>
        <div className="toggle-container">
          <button 
            className={passwordType === 'meaningful' ? 'active' : ''} 
            onClick={() => setPasswordType('meaningful')}
          >
            Meaningful
          </button>
          <button 
            className={passwordType === 'random' ? 'active' : ''} 
            onClick={() => setPasswordType('random')}
          >
            Random
          </button>
        </div>
      </div>
      
      <div className="length-control">
        <label htmlFor="length">Password Length: {passwordLength}</label>
        <input 
          type="range" 
          id="length" 
          min="8" 
          max="20" 
          value={passwordLength} 
          onChange={(e) => setPasswordLength(parseInt(e.target.value))} 
        />
      </div>
      
      <button 
        className="generate-btn" 
        onClick={generatePassword}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate New Password'}
      </button>
    </div>
  );
};

export default PasswordControls;
