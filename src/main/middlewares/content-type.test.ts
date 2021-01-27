import request from 'supertest'
import app from '../app'

describe('Content Middleware', () => {
  it('Should return default content-type as json', async () => {
    app.get('/content_type', (req, res) => res.send(''))
    await request(app)
      .get('/content_type')
      .expect('content-type', /json/)
  })

  it('Should return xml content-type when forced', async () => {
    app.get('/content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/content_type_xml')
      .expect('content-type', /xml/)
  })
})
