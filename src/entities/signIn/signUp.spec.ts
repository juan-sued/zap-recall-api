import { expect, test } from 'vitest'
import { SignUp } from '..'

test('register an user', () => {
  const signUp = new SignUp({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword',
    confirmPassword: 'securePassword'
  })

  expect(signUp).toBeInstanceOf(SignUp)
  expect(signUp.name).toEqual('John Doe')
  expect(signUp.email).toEqual('john@example.com')
  expect(signUp.password).toEqual('securePassword')
  expect(signUp.confirmPassword).toEqual('securePassword')
})

test('throws error for mismatched password and confirmPassword', () => {
  expect(
    () =>
      new SignUp({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword',
        confirmPassword: 'differentPassword'
      })
  ).toThrowError('Password and confirmPassword must match')
})
