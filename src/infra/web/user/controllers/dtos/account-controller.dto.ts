export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
}
export interface RegisterResponse {
  message: string
}
