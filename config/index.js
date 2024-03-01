import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

export default {
  routeKey: process.env.ROUTE_KEY,
  httpClients: {
    bareHttp: {},
  }
}