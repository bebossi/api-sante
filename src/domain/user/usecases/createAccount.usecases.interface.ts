export interface CreateUserUsecaseInput {
  name: string
  email: string
  password: string
  role: string
}

export interface ICreateUserUsecases {
  execute(input: CreateUserUsecaseInput): Promise<void>
}
