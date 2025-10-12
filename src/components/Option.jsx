import React from 'react'

const Option = ({ option, selected, onSelect }) => {
  return (
    <button 
      onClick={onSelect}
      className={`flex items-center justify-center w-24 border-primary ${selected ? "font-bold text-primary border-2" : "text-gray-400 border"}`}
    >
      <p className="py-2 px-4 text-sm">{option}</p>
    </button>
  )
}

export default Option;