import { NotificationErrorProps } from './notification'

export default class NotificationError extends Error {
  constructor(public errors: NotificationErrorProps[]) {
    super(errors.map((error) => `${error.context}: ${error.message}`).join(','))

    Object.setPrototypeOf(this, new.target.prototype) // makes "error instanceof NotificationError" return true
    this.name = this.constructor.name // makes error.toString() return NotificatinError instead of Error
    Error.captureStackTrace(this, this.constructor) // make NotificationError itself do not appear on stack trace
  }
}
