import React from 'react'

const ProgressBar = ({ value }) => {
  return (
    <div className="relative">
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-linear-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar