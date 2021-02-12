import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys/load-surveys-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router) => {
  router.post(
    '/surveys',
    adminAuth,
    expressRouteAdapter(makeAddSurveyController()
    ))

  router.get(
    '/surveys',
    auth,
    expressRouteAdapter(makeLoadSurveysController()
    ))
}
