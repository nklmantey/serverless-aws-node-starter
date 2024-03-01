import debug from 'debug'
import { name as applicationName } from '../../package.json'

export default logName => debug(`${applicationName}:${logName}`)