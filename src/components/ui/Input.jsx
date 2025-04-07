import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;