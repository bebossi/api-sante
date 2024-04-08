class NoProductsRegisteredError extends Error {
  constructor(message = 'No products registered') {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.message = message
  }
}

export { NoProductsRegisteredError }
