export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/for-dev-api',
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || 'ppdmqsl2kj_adl5'

}
