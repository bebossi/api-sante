export interface CreateAccountUsecaseInput {
  name: string
  email: string
  password: string
  role: string
}

export interface ICreateAccountUsecases {
  execute(input: CreateAccountUsecaseInput): Promise<void>
}
