import CustomException from '@tetris/base-lib/CustomException'

export default class MissingRequiredFieldError extends CustomException {
  constructor (field) {
    super(`${field} is required`)
    this.field = field
  }
}

MissingRequiredFieldError.displayName = 'MissingRequiredFieldError'
