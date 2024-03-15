class EmailAlreadyInUseError extends Error {
  constructor(message = 'This email is already in use') {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.message = message
  }
}

export { EmailAlreadyInUseError }
