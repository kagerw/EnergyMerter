import React from 'react'
import { Book, Brain, Smartphone, UtensilsCrossed, Bath, CloudSun, MessageCircle, PenTool, Gamepad2 } from 'lucide-react'

const QuestionCard = ({ question, index, answer, onAnswerChange }) => {
  const iconMap = {
    Book, Brain, Smartphone, UtensilsCrossed, Bath, 
    CloudSun, MessageCircle, PenTool, Gamepad2
  }

  const Icon = iconMap[question.icon_name] || Book
  const colors = [
    'text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500',
    'text-cyan-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500', 'text-red-500'
  ]

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-3">
        <Icon className={`w-5 h-5 ${colors[index % colors.length]} mr-2`} />
        <span className="font-medium">{index + 1}. {question.question_text}</span>
      </div>
      <div className="flex space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={question.question_key}
            value="true"
            checked={answer === true}
            onChange={() => onAnswerChange(question.question_key, true)}
            className="mr-2 text-blue-500"
          />
          <span className="text-green-600 font-medium">はい</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={question.question_key}
            value="false"
            checked={answer === false}
            onChange={() => onAnswerChange(question.question_key, false)}
            className="mr-2 text-blue-500"
          />
          <span className="text-red-600 font-medium">いいえ</span>
        </label>
      </div>
    </div>
  )
}

export default QuestionCard