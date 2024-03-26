import bcrypt from 'bcrypt'

class Encrypt {
  public static async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 5)

    return encryptedPassword
  }

  public static async compare(
    password: string,
    encryptedPassword: string
  ): Promise<boolean> {
    const isSamePassword = await bcrypt.compare(password, encryptedPassword)

    return isSamePassword
  }
}

export { Encrypt }
