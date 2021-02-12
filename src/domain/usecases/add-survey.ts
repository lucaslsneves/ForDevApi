import { SurveyAnswers } from '../entities/survey-entity'

export interface AddSurveyParams {
  question: string
  answers: SurveyAnswers[],
  date: Date
}

export interface AddSurvey {
   add(survey: AddSurveyParams): Promise<void>
}
