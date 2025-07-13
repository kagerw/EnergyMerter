import React from 'react'

const ScoreDisplay = ({ answers, totalQuestions }) => {
  const currentScore = Object.values(answers).filter(a => a === true).length
  const percentage = (currentScore / totalQuestions) * 100

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-medium">現在のスコア：</span>
        <span className="text-2xl font-bold text-blue-600">
          {currentScore} / {totalQuestions}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ScoreDisplay