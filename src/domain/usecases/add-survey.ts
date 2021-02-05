
export interface SurveyAnswers {
  image?: string
  anwser: string
}

export interface AddSurveyParams {
  question: string
  answers: SurveyAnswers[]
}

export interface AddSurvey {
   add(survey: AddSurveyParams): Promise<void>
}
