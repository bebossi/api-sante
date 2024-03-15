export default interface EntityValidator<T> {
  validate(entity: T): void
}
