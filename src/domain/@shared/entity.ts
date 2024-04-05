import Notification from './notification/notification'

export abstract class Entity {
  protected _id: any
  protected _notification: Notification

  constructor() {
    this._notification = new Notification()
  }

  abstract toJSON(): any

  equals(obj: this) {
    if (obj === null || obj === undefined) {
      return false
    }

    if (obj._id === undefined) {
      return false
    }

    if (obj.constructor.name !== this.constructor.name) {
      return false
    }

    return obj._id.equals(this._id)
  }

  get notification() {
    return this._notification
  }

  get id() {
    return this._id
  }

  protected set id(id: any) {
    this._id = id
  }
}
