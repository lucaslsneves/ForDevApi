import { Express, Router } from 'express'
import path from 'path'
import fg from 'fast-glob'

export const setupRoutes = (app:Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync(path.join('**', 'src', 'main', 'routes', '**routes.ts')).map(async file => {
    (await import(path.join('..', '..', '..', file))).default(router)
  })
}
