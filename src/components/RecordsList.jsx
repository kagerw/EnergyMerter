import React from 'react'
import { Sun, Bed } from 'lucide-react'

const RecordsList = ({ records, totalQuestions }) => {
  if (records.length === 0) {
    return <p className="text-gray-500 text-center py-8">まだ記録がありません</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">記録履歴</h3>
      {records.map((record) => (
        <div key={record.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{record.record_date}</span>
            <div className="flex items-center space-x-2">
              {record.wake_up_time && (
                <span className="text-sm text-gray-600">
                  <Sun className="w-4 h-4 inline mr-1" />
                  {record.wake_up_time}
                </span>
              )}
              {record.sleep_score && (
                <span className="text-sm text-gray-600">
                  <Bed className="w-4 h-4 inline mr-1" />
                  {record.sleep_score}
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {record.total_score} / {totalQuestions}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(record.total_score / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecordsList