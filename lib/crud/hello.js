export default ({ createLogger }) => async () => {
  const log = createLogger('hello')

  log('Hello endpoint has been hit')

  return { data: 'Hello world' }
}