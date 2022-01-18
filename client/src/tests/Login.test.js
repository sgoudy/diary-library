import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import Landing from '../components/Landing/index.jsx'

test('renders Login page', () => {
  render(<Landing />)
  expect(screen.getByText('Welcome to the Diary Library')).toBeInTheDocument()
  expect(screen.getByText('All your notes in books. Secured.')).toBeInTheDocument()
  
  expect(screen.getByTitle('email')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()

  expect(screen.getByTitle('password')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()

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
