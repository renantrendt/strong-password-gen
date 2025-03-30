import React from 'react';
import '../styles/PasswordDisplay.css';

const PasswordDisplay = ({ password, isLoading, copied, copyToClipboard }) => {
  return (
    <div className="password-display">
      <input type="text" value={isLoading ? "Loading..." : password} readOnly />
      <button 
        onClick={copyToClipboard} 
        className={copied ? 'copied' : ''}
        disabled={isLoading}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default PasswordDisplay;
