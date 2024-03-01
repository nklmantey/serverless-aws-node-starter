'use strict'

const container = require('./lib/dependency')
const {
  pick,
  defaultWhen,
  isNilOrEmpty,
  fromJson,
  is,
  assocPath
} = require('@meltwater/phi')

const convertStringToObj = (raw) => (is(String, raw) ? fromJson(raw) : raw)

const lambdaMiddleware = ({ status, data, error }) => {
  return {
    statusCode: status || 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ data, error, success: !!data }, null, 2)
  }
}

module.exports.endpointRoute = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false


  let inputObject = pick(
    [
      'body',
      'requestContext',
      'pathParameters',
      'queryStringParameters',
      'Records',
      'headers'
    ],
    defaultWhen(isNilOrEmpty, {}, event)
  )
  inputObject = assocPath(
    ['body'],
    convertStringToObj(inputObject.body),
    inputObject
  )
  const config = container.resolve('config')
  const { routeKey } = config
  const routeFunction = container.resolve(routeKey)
  const response = await routeFunction(inputObject)
  return lambdaMiddleware(response)
}