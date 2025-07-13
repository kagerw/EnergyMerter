import React, { useState, useEffect } from 'react'
import { Calendar, BarChart3, Sun, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import QuestionCard from './QuestionCard'
import ScoreDisplay from './ScoreDisplay'
import StatsCards from './StatsCards'
import RecordsList from './RecordsList'
import DateSelector from './DateSelector'
import SaveDialog from './SaveDialog'

const MotivationTracker = () => {
  const { user, signOut } = useAuth()
  const [records, setRecords] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [wakeUpTime, setWakeUpTime] = useState('')
  const [activeTab, setActiveTab] = useState('today')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    loadQuestions()
    loadRecords()
  }, [])

  useEffect(() => {
    loadTodayRecord()
  }, [selectedDate, questions])

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error
      setQuestions(data || [])
      
      const initialAnswers = {}
      data?.forEach(q => {
        initialAnswers[q.question_key] = null
      })
      setAnswers(initialAnswers)
    } catch (error) {
      console.error('質問の読み込みに失敗しました:', error)
    }
  }

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_records')
        .select(`*`)
        .eq('user_id', user?.id)
        .order('record_date', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('記録の読み込みに失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTodayRecord = async () => {
    if (!questions.length) return

    try {
      const { data, error } = await supabase
        .from('daily_records')
        .select(`
          *,
          answers (
            question_id,
            answer_value,
            questions (question_key)
          )
        `)
        .eq('user_id', user?.id)
        .eq('record_date', selectedDate)
        .single()

      if (data) {
        setWakeUpTime(data.wake_up_time || '')
        
        const dayAnswers = {}
        questions.forEach(q => {
          const answer = data.answers?.find(a => a.questions.question_key === q.question_key)
          dayAnswers[q.question_key] = answer?.answer_value ?? null
        })
        setAnswers(dayAnswers)
      } else {
        setWakeUpTime('')
        const initialAnswers = {}
        questions.forEach(q => {
          initialAnswers[q.question_key] = null
        })
        setAnswers(initialAnswers)
      }
    } catch (error) {
      setWakeUpTime('')
      const initialAnswers = {}
      questions.forEach(q => {
        initialAnswers[q.question_key] = null
      })
      setAnswers(initialAnswers)
    }
  }

  const saveRecord = async () => {
    try {
      const score = Object.values(answers).filter(a => a === true).length

      const { data: recordData, error: recordError } = await supabase
        .from('daily_records')
        .upsert({
          user_id: user.id,
          record_date: selectedDate,
          wake_up_time: wakeUpTime || null,
          total_score: score
        }, {
          onConflict: 'user_id,record_date'
        })
        .select()
        .single()

      if (recordError) throw recordError

      const answersToInsert = questions.map(q => ({
        daily_record_id: recordData.id,
        question_id: q.id,
        answer_value: answers[q.question_key]
      })).filter(a => a.answer_value !== null)

      if (answersToInsert.length > 0) {
        await supabase
          .from('answers')
          .delete()
          .eq('daily_record_id', recordData.id)

        const { error: answersError } = await supabase
          .from('answers')
          .insert(answersToInsert)

        if (answersError) throw answersError
      }

      await loadRecords()
      setShowSaveDialog(true)
    } catch (error) {
      console.error('記録の保存に失敗しました:', error)
      alert('記録の保存に失敗しました。')
    }
  }

  const updateAnswer = (questionKey, value) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }))
  }

  const getStats = () => {
    if (records.length === 0) return { avgScore: 0, maxScore: 0, recentTrend: 0 }
    
    const scores = records.map(r => r.total_score)
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const maxScore = Math.max(...scores)
    
    const recent7 = records.slice(0, 7)
    const recentTrend = recent7.length > 1 ? 
      recent7[0].total_score - recent7[recent7.length - 1].total_score : 0
    
    return { avgScore, maxScore, recentTrend }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🪫 やる気メーター</h1>
            <p className="text-gray-600">毎日の気力を記録して、自分の調子を把握しよう</p>
          </div>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        </div>

        <div className="flex bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'today' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            今日の記録
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            履歴・統計
          </button>
        </div>

        {activeTab === 'today' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DateSelector 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate} 
            />

            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-medium">今日の起床時間：</span>
              </div>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4 mb-6">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  answer={answers[question.question_key]}
                  onAnswerChange={updateAnswer}
                />
              ))}
            </div>

            <ScoreDisplay answers={answers} totalQuestions={questions.length} />

            <button
              onClick={saveRecord}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              記録を保存
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <StatsCards stats={getStats()} />
            <RecordsList records={records} totalQuestions={questions.length} />
          </div>
        )}
      </div>

      <SaveDialog 
        show={showSaveDialog} 
        onClose={() => setShowSaveDialog(false)} 
      />
    </div>
  )
}

export default MotivationTracker