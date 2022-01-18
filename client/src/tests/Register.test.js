import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import Register from '../components/Register/index.jsx'

test('renders Registration page', () => {
  render(<Register />)
  expect(screen.getByText('Create an Account')).toBeInTheDocument()

  expect(screen.getByText('Name')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()

  expect(screen.getByText('Email')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()

  expect(screen.getByText('Password')).toBeInTheDocument()

  const passwordInput = screen.getByPlaceholderText('Enter password')
  fireEvent.change(passwordInput, { target: { value: 'test' } })

  // should not show plain password
  expect(screen.queryByText('test')).not.toBeInTheDocument()
  expect(passwordInput).toHaveAttribute('type', 'password')

  // click the password visibility icon
  const visibilityIcon = screen.getAllByRole('button')[0]
  expect(visibilityIcon).toBeInTheDocument()
  fireEvent.click(visibilityIcon)

  // can see password in plain text after clicking
  expect(screen.getByDisplayValue('test')).toBeInTheDocument()
  expect(passwordInput).toHaveAttribute('type', 'text')
})