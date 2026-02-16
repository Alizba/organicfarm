import React from 'react'

const Button = ({ 
  children,        
  onClick,            
  variant = 'primary',
  size = 'medium',    
  disabled = false,   
  className = '',     
  type = 'button'    
}) => {
  
  const baseStyles = 'font-medium rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-green-700 hover:bg-green-800 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-green-700 text-green-700 hover:bg-green-50'
  }
  
  const sizes = {
    small: 'px-4 py-1.5 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
    
    }
    >
      {children}
    </button>
  )
}

export default Button