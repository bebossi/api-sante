export interface CreateAccountUsecaseInput {
  name: string
  email: string
  password: string
}

export interface ICreateAccountUsecases {
  execute(input: CreateAccountUsecaseInput): Promise<void>
}
