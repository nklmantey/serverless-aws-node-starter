// Env vars
import config from '../../config'

// Utils
import createLogger from '../utils/logger'
import registerHttpClients from '../utils/register-http-client'
import createErrorResponse, { errorCodes } from '../utils/errors'

// API
import createHello from '../crud/hello'

const { asValue, asFunction, createContainer } = require('awilix')

const container = createContainer()

// Utilities
container.register('config', asValue(config))
container.register('createLogger', asValue(createLogger))
container.register('errorCodes', asValue(errorCodes))
container.register('createErrorResponse', asValue(createErrorResponse))

// APIs
container.register('hello', asFunction(createHello).scoped())

// Register Http Clients
registerHttpClients({ container, config })

module.exports = container