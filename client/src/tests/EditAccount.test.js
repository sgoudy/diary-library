import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import { AuthContext } from '../context/AuthContext.js'
import EditAccount from '../components/EditAccount/index.jsx'
import { testUser } from './resources/userFixtures.js'

test('renders Edit Account page', () => {
  // authContext to check for pre-filled block values
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <EditAccount />
    </AuthContext.Provider>,
  )
  expect(screen.getByText('Edit Account')).toBeInTheDocument()

  expect(screen.getByDisplayValue(testUser.name)).toBeInTheDocument()
  expect(screen.getByDisplayValue(testUser.email)).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()

  const passwordInput = screen.getByPlaceholderText('Password')
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

  // check for cancel & submit buttons
  const cancelBtn = screen.getAllByRole('button')[1]
  expect(cancelBtn).toBeInTheDocument()
  const submitBtn = screen.getAllByRole('button')[2]
  expect(submitBtn).toBeInTheDocument()
})
