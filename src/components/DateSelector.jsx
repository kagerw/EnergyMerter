import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DateSelector = ({ selectedDate, onDateChange }) => {
  const changeDate = (direction) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + direction)
    onDateChange(date.toISOString().split('T')[0])
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => changeDate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="text-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="text-lg font-semibold border-none bg-transparent text-center"
        />
      </div>
      <button
        onClick={() => changeDate(1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default DateSelector