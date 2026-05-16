interface ClassificationQuestion {
  id: string;
  question: string;
  category: 'academic' | 'financial' | 'language' | 'experience' | 'motivation';
  options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
  weight: number;
}

export const classificationQuestions: ClassificationQuestion[] = [
  {
    id: 'academic_performance',
    question: 'What is your current academic standing?',
    category: 'academic',
    weight: 3,
    options: [
      { value: 'first_class', label: 'First Class / 4.5+ GPA', score: 10 },
      { value: 'second_upper', label: 'Second Class Upper / 3.5-4.49 GPA', score: 7 },
      { value: 'second_lower', label: 'Second Class Lower / 2.5-3.49 GPA', score: 4 },
      { value: 'third_class', label: 'Third Class / Below 2.5 GPA', score: 2 },
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
      { value: 'ielts_6_6.5', label: 'IELTS 6.0-6.5 / TOEFL 80-99', score: 6 },
      { value: 'ielts_below_6', label: 'IELTS Below 6.0 / TOEFL Below 80', score: 3 },
      { value: 'no_test', label: 'No English Test Yet', score: 1 },
    ]
  },
  {
    id: 'financial_capability',
    question: 'How do you plan to fund your education?',
    category: 'financial',
    weight: 2,
    options: [
      { value: 'full_scholarship', label: 'Full Scholarship', score: 5 },
      { value: 'family_funding', label: 'Family/Personal Funding Available', score: 8 },
      { value: 'partial_funding', label: 'Partial Funding Available', score: 6 },
      { value: 'loan', label: 'Education Loan', score: 7 },
      { value: 'seeking_funding', label: 'Still Seeking Funding', score: 3 },
    ]
  },
  {
    id: 'international_experience',
    question: 'Do you have any international experience?',
    category: 'experience',
    weight: 1.5,
    options: [
      { value: 'studied_abroad', label: 'Previously Studied Abroad', score: 8 },
      { value: 'traveled', label: 'Traveled Internationally', score: 6 },
      { value: 'online_courses', label: 'Taken International Online Courses', score: 5 },
      { value: 'none', label: 'No International Experience', score: 3 },
    ]
  },
  {
    id: 'career_goals',
    question: 'How clear are your career goals?',
    category: 'motivation',
    weight: 1.5,
    options: [
      { value: 'very_clear', label: 'Very Clear with Specific Plan', score: 9 },
      { value: 'clear', label: 'Clear but Flexible', score: 7 },
      { value: 'somewhat_clear', label: 'Somewhat Clear', score: 5 },
      { value: 'exploring', label: 'Still Exploring Options', score: 3 },
    ]
  }
];

export const calculateProbability = (
  responses: Array<{ questionId: string; answer: string }>
): { score: 'high' | 'medium' | 'low'; points: number; breakdown: any } => {
  let totalScore = 0;
  let maxScore = 0;
  const breakdown: any[] = [];

  classificationQuestions.forEach(question => {
    const response = responses.find(r => r.questionId === question.id);
    if (response) {
      const option = question.options.find(o => o.value === response.answer);
      if (option) {
        const weightedScore = option.score * question.weight;
        totalScore += weightedScore;
        maxScore += 10 * question.weight; // Max possible score per question
        breakdown.push({
          questionId: question.id,
          question: question.question,
          answer: option.label,
          score: option.score,
          weightedScore,
          weight: question.weight
        });
      }
    }
  });

  const percentage = (totalScore / maxScore) * 100;
  
  let score: 'high' | 'medium' | 'low';
  if (percentage >= 75) score = 'high';
  else if (percentage >= 50) score = 'medium';
  else score = 'low';

  return {
    score,
    points: Math.round(totalScore),
    breakdown
  };
};

export const getRecommendation = (score: 'high' | 'medium' | 'low') => {
  const recommendations = {
    high: {
      message: 'Excellent candidate! High probability of admission success.',
      nextSteps: [
        'Fast-track application processing',
        'Priority scholarship consideration',
        'Direct consultation with admission advisor'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '🌟'
    },
    medium: {
      message: 'Good candidate with potential for success.',
      nextSteps: [
        'Standard application processing',
        'Additional document review',
        'Scholarship application guidance'
      ],
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '📚'
    },
    low: {
      message: 'Candidate may need additional preparation.',
      nextSteps: [
        'English language improvement recommended',
        'Academic strengthening suggested',
        'Alternative program options available'
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '💡'
    }
  };
  
  return recommendations[score];
};  


