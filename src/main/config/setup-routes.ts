import { Express, Router } from 'express'
import path from 'path'
import { readdirSync } from 'fs'

export const setupRoutes = (app:Express): void => {
  const router = Router()
  app.use('/api', router)

  readdirSync(path.join(__dirname, '..', 'routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import(path.join('..', 'routes', file))).default(router)
    }
  })
}
