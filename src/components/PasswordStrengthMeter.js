import React from 'react';
import { getStrengthCategory } from '../utils/passwordUtils';
import '../styles/PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ passwordStrength }) => {
  const strengthCategory = getStrengthCategory(passwordStrength);
  
  return (
    <div className="strength-meter">
      <div className="strength-label">
        <span>Password Strength:</span>
        <span className={`strength-text strength-${strengthCategory}`}>
          {strengthCategory.charAt(0).toUpperCase() + strengthCategory.slice(1)}
        </span>
      </div>
      <div className="strength-bar">
        <div 
          className={`strength-fill strength-${strengthCategory}`} 
          style={{ width: `${passwordStrength}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
