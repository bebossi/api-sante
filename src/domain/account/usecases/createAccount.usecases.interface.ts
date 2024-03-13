export interface CreateUserUseCaseInput {
  name: string
  email: string
  password: string
}

export interface ICreateAccountUsecases {
  execute(input: CreateUserUseCaseInput): Promise<void>
}
