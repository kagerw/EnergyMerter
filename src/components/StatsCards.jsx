import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">平均スコア</p>
            <p className="text-2xl font-bold text-blue-600">{stats.avgScore.toFixed(1)}</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">最高スコア</p>
            <p className="text-2xl font-bold text-green-600">{stats.maxScore}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">最近の傾向</p>
            <p className={`text-2xl font-bold ${stats.recentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.recentTrend >= 0 ? '+' : ''}{stats.recentTrend}
            </p>
          </div>
          <TrendingUp className={`w-8 h-8 ${stats.recentTrend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </div>
    </div>
  )
}

export default StatsCards