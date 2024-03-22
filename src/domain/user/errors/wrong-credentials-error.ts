class WrongCredentialsError extends Error {
  constructor(message = 'Email or password are invalid') {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.message = message
  }
}

export { WrongCredentialsError }
