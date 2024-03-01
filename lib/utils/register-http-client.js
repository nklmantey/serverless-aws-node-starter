import axios from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import {
  identity,
  mapObjIndexed,
  prop,
  toLower,
  toString,
  toJson,
  pick,
  defaultTo
} from '@meltwater/phi'
import { asValue } from 'awilix'
import createLogger from './logger'

export const createErrorHandler = () => err => {
  const { request = {}, response = {}, message, stack } = err
  const { baseURL, url, method, responseType } = request
  const { status, statusText, data } = response
  return Promise.reject(new Error(`
    body -> ${toString(defaultTo('', data))}
    config -> method: ${method}, baseurl: ${baseURL}, url: ${url}, responseType: ${responseType},
    response -> status: ${status}, statusText: ${statusText}
    error -> message: ${message}
    stack -> ${toString(defaultTo('', stack))}
  `))
}
export const createRequestLogger = name => request => {
  const method = toLower(request.method)
  const log = createLogger(`${name}:${method}`)
  log('Firing request', toJson(pick(['url', 'method', 'baseURL', 'data', 'headers'], request)))
  return request
}
export default ({ container, config }) => mapObjIndexed((clientInfo, name) => {
  const { retries, ...otherClientOptions } = clientInfo
  const fullName = `${name}Client`
  const retryDelay = exponentialDelay
  const httpClient = axios.create(otherClientOptions)
  httpClient.interceptors.request.use(createRequestLogger(name))
  httpClient.interceptors.response.use(identity, createErrorHandler())
  axiosRetry(httpClient, { retries, retryDelay })
  container.register(fullName, asValue(httpClient))
}, prop('httpClients', config))