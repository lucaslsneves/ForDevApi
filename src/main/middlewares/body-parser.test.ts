import request from 'supertest'
import app from '../app'

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/body_parser', (req, res) => res.send(req.body))
    await request(app)
      .post('/body_parser')
      .send({ name: 'Lucas' })
      .expect({ name: 'Lucas' })
  })
})
