import { ISignUp } from '@/interfaces/auth'

export class SignUp {
  private props: ISignUp

  // Getters
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get confirmPassword() {
    return this.props.confirmPassword
  }

  constructor(props: ISignUp) {
    const { password, confirmPassword } = props

    if (password !== confirmPassword) {
      console.log('senhas diferentes')
      throw new Error('Password and confirmPassword must match')
    }

    this.props = props
  }
}
