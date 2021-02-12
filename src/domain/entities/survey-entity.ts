export interface SurveyAnswers {
  image?: string
  anwser: string
}

export interface SurveyEntity {
  id: string
  question: string
  answers: SurveyAnswers[],
  date: Date
}
