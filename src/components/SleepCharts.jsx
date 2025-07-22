import React from 'react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts'
import { Clock, Moon, Bed } from 'lucide-react'

const SleepCharts = ({ sleepData }) => {
  // 睡眠時間を計算する関数
  const calculateSleepDuration = (bedtime, wakeUpTime) => {
    if (!bedtime || !wakeUpTime) return null
    
    const [bedHour, bedMin] = bedtime.split(':').map(Number)
    const [wakeHour, wakeMin] = wakeUpTime.split(':').map(Number)
    
    let bedTimeMinutes = bedHour * 60 + bedMin
    let wakeTimeMinutes = wakeHour * 60 + wakeMin
    
    // 就寝時間が翌日の場合
    if (wakeTimeMinutes < bedTimeMinutes) {
      wakeTimeMinutes += 24 * 60
    }
    
    const sleepMinutes = wakeTimeMinutes - bedTimeMinutes
    return (sleepMinutes / 60).toFixed(1)
  }

  // 時間をグラフ用の数値に変換（午前0時を0とする）
  const timeToNumber = (timeString) => {
    if (!timeString) return null
    const [hour, minute] = timeString.split(':').map(Number)
    return hour + minute / 60
  }

  // 数値を時間文字列に戻す
  const numberToTime = (number) => {
    const hour = Math.floor(number)
    const minute = Math.round((number - hour) * 60)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  // 就寝時間を24時間以上の数値に変換（深夜の場合）
  const bedtimeToNumber = (timeString) => {
    if (!timeString) return null
    const [hour, minute] = timeString.split(':').map(Number)
    const timeNumber = hour + minute / 60
    // 20時以前の場合は翌日扱い（深夜帯と判断）
    return timeNumber < 20 ? timeNumber + 24 : timeNumber
  }

  // グラフ用のデータを準備
  const chartData = sleepData.map(record => {
    const sleepDuration = calculateSleepDuration(record.bedtime, record.wake_up_time)
    const recordDate = new Date(record.record_date)
    
    return {
      date: recordDate.toLocaleDateString('ja-JP', { 
        month: 'numeric', 
        day: 'numeric' 
      }) + '(' + recordDate.toLocaleDateString('ja-JP', { weekday: 'short' }) + ')',
      fullDate: record.record_date,
      wakeUpTime: timeToNumber(record.wake_up_time),
      bedtime: bedtimeToNumber(record.bedtime),
      sleepScore: record.sleep_score,
      sleepDuration: sleepDuration ? parseFloat(sleepDuration) : null,
      // 表示用の時間文字列も保持
      wakeUpTimeStr: record.wake_up_time,
      bedtimeStr: record.bedtime
    }
  }) // reverseを削除して、データベースから取得した順序（古い→新しい）のままにする

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'wakeUpTime' && entry.value && (
                `起床時間: ${numberToTime(entry.value)}`
              )}
              {entry.dataKey === 'bedtime' && entry.value && (
                `就寝時間: ${entry.value >= 24 ? numberToTime(entry.value - 24) : numberToTime(entry.value)}`
              )}
              {entry.dataKey === 'sleepScore' && entry.value && (
                `睡眠スコア: ${entry.value}点`
              )}
              {entry.dataKey === 'sleepDuration' && entry.value && (
                `睡眠時間: ${entry.value}時間`
              )}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          <Bed className="w-6 h-6 inline mr-2" />
          1週間の睡眠データ
        </h2>
        <p className="text-gray-600">起床時間、睡眠時間、睡眠スコアの推移を確認できます</p>
      </div>

      {/* 起床時間のグラフ */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-yellow-100">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">起床時間の推移</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[5, 12]}
              tickFormatter={(value) => numberToTime(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={8} stroke="#22c55e" strokeDasharray="5 5" label="理想的な起床時間 (8:00)" />
            <Line 
              type="monotone" 
              dataKey="wakeUpTime" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
              name="起床時間"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 就寝時間のグラフ */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
        <div className="flex items-center mb-4">
          <Moon className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">就寝時間の推移</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[20, 26]}
              tickFormatter={(value) => {
                // 24時間を超える場合は翌日扱い
                if (value >= 24) {
                  return numberToTime(value - 24)
                }
                return numberToTime(value)
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="5 5" label="理想的な就寝時間 (1:00)" />
            <Line 
              type="monotone" 
              dataKey="bedtime" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              name="就寝時間"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 睡眠時間のグラフ */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
        <div className="flex items-center mb-4">
          <Bed className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">睡眠時間の推移</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 12]}
              tick={{ fontSize: 12 }}
              label={{ value: '時間', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={7} stroke="#22c55e" strokeDasharray="5 5" label="推奨睡眠時間 (7時間)" />
            <ReferenceLine y={8} stroke="#22c55e" strokeDasharray="5 5" label="推奨睡眠時間 (8時間)" />
            <Bar 
              dataKey="sleepDuration" 
              fill="#3b82f6" 
              name="睡眠時間"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* 睡眠スコアのグラフ */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
        <div className="flex items-center mb-4">
          <Bed className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">睡眠スコアの推移</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: 'スコア', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="5 5" label="良好な睡眠スコア (70点以上)" />
            <Line 
              type="monotone" 
              dataKey="sleepScore" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              name="睡眠スコア"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* データがない場合の表示 */}
      {sleepData.length === 0 && (
        <div className="text-center py-12">
          <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">睡眠データがありません</h3>
          <p className="text-gray-400">まずは「今日の記録」で睡眠データを入力してみましょう！</p>
        </div>
      )}
    </div>
  )
}

export default SleepCharts