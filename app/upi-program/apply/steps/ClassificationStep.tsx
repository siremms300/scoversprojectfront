'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react'

const questions = [
  {
    id: 'academic_performance',
    question: 'What is your current academic standing?',
    category: 'academic',
    weight: 3,
    options: [
      { value: 'first_class', label: 'First Class / Distinction', score: 10 },
      { value: 'second_upper', label: 'Second Class Upper / Credit', score: 7 },
      { value: 'second_lower', label: 'Second Class Lower', score: 4 },
      { value: 'third_class', label: 'Third Class / Pass', score: 2 },
    ]
  },
  {
    id: 'english_proficiency',
    question: 'What is your English proficiency level?',
    category: 'language',
    weight: 2,
    options: [
      { value: 'native', label: 'Native Speaker', score: 10 },
      { value: 'ielts_7_plus', label: 'IELTS 7.0+ / TOEFL 100+', score: 8 },
      { value: 'ielts_6', label: 'IELTS 6.0-6.5 / TOEFL 80-99', score: 6 },
      { value: 'below', label: 'Below Requirements', score: 3 },
    ]
  },
  {
    id: 'financial_readiness',
    question: 'How prepared are you financially?',
    category: 'financial',
    weight: 2,
    options: [
      { value: 'full_funding', label: 'Full funding secured', score: 8 },
      { value: 'partial', label: 'Partial funding available', score: 6 },
      { value: 'exploring', label: 'Exploring scholarship options', score: 4 },
      { value: 'not_ready', label: 'Not yet prepared', score: 2 },
    ]
  },
  {
    id: 'career_clarity',
    question: 'How clear are your career goals?',
    category: 'motivation',
    weight: 1.5,
    options: [
      { value: 'very_clear', label: 'Very clear with specific plan', score: 9 },
      { value: 'clear', label: 'Clear direction', score: 7 },
      { value: 'somewhat', label: 'Somewhat clear', score: 5 },
      { value: 'exploring', label: 'Still exploring options', score: 3 },
    ]
  },
  {
    id: 'international_experience',
    question: 'Do you have international experience?',
    category: 'experience',
    weight: 1.5,
    options: [
      { value: 'studied', label: 'Studied abroad before', score: 8 },
      { value: 'traveled', label: 'Traveled internationally', score: 6 },
      { value: 'online', label: 'Online international courses', score: 5 },
      { value: 'none', label: 'No international experience', score: 3 },
    ]
  },
]

interface Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ClassificationStep({ data, onUpdate, onNext, onBack }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    data?.reduce((acc: any, item: any) => ({ ...acc, [item.questionId]: item.answer }), {}) || {}
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleAnswer = (questionId: string, value: string, option: any) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    
    // Auto-advance to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    }
  }

  const handleSubmit = () => {
    const responses = questions.map(q => {
      const answer = answers[q.id]
      const option = q.options.find(o => o.value === answer)
      return {
        questionId: q.id,
        question: q.question,
        answer,
        category: q.category,
        weight: q.weight,
        score: option ? option.score * q.weight : 0,
      }
    })
    onUpdate(responses)
    onNext()
  }

  const allAnswered = questions.every(q => answers[q.id])
  const question = questions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Question counter */}
      <div className="flex items-center gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < currentQuestion 
                ? 'bg-emerald-500' 
                : i === currentQuestion 
                  ? 'bg-[#247BF7]' 
                  : answers[questions[i].id] 
                    ? 'bg-emerald-500' 
                    : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="card-premium p-6 md:p-8">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-8">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.id, option.value, option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers[question.id] === option.value
                  ? 'border-[#247BF7] bg-[#247BF7]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{option.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  answers[question.id] === option.value
                    ? 'border-[#247BF7]'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === option.value && (
                    <div className="w-2.5 h-2.5 bg-[#247BF7] rounded-full" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQuestion
                  ? 'bg-[#247BF7] w-6'
                  : answers[questions[i].id]
                    ? 'bg-emerald-400'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {allAnswered && (
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}