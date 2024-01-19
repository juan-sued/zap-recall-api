import { authInterfaces } from '@/interfaces'

export class SignUp {
  private props: authInterfaces.ISignUpRequest

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

  constructor(props: authInterfaces.ISignUpRequest) {
    const { password, confirmPassword } = props

    if (password !== confirmPassword) {
      throw new Error('Password and confirmPassword must match')
    }

    this.props = props
  }
}
