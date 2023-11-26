import { authInterfaces } from '@/interfaces'

export class SignIn {
  private props: authInterfaces.ISignInRequest

  // Getters

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  constructor(props: authInterfaces.ISignInRequest) {
    this.props = props
  }
}
