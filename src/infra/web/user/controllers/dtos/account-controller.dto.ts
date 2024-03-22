export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
}
export interface RegisterResponse {
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export type LoginResponse = { token: string } | { message: string }
