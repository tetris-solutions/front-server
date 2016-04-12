import CustomException from '@tetris/base-lib/CustomException'

export default class InvalidArgumentError extends CustomException {
  constructor (arg) {
    super(`${arg} is not a valid argument`)
  }
}

InvalidArgumentError.displayName = 'InvalidArgumentError'
