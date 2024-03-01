import { compose, isNilOrEmpty, assocPath, when, isNotNilOrEmpty } from '@meltwater/phi'

export const errorCodes = {
  ValidationError: {
    status: 403,
    error: {
      message: 'The information received is incorrect'
    }
  },
  UserAlreadyExists: {
    status: 401,
    error: {
      message: 'The user already exists'
    }
  },
  EmailOrPasswordIncorrect: {
    status: 401,
    error: {
      message: 'The email or password provided is incorrect'
    }
  }
}

export default function (code, details) {
  const matchedCode = errorCodes[code]
  if (isNilOrEmpty(matchedCode)) throw new Error('WrongErrorCode - ' + code)

  const buildError = compose(
    when(() => isNotNilOrEmpty(details), assocPath(['error', 'details'], details)),
    assocPath(['error', 'code'], code)
  )

  return buildError(matchedCode)
}