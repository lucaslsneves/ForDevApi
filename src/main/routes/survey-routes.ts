import { Router } from 'express'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router) => {
  const adminAuth = makeAuthMiddleware('admin')
  router.post('/surveys', expressMiddlewareAdapter(adminAuth), expressRouteAdapter(makeAddSurveyController()))
}
