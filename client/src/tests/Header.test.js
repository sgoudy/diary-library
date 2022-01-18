import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import { AuthContext } from '../context/AuthContext.js'
import Header from '../components/Header/index.jsx'
import { testUser } from './resources/userFixtures.js'

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}))

test('renders Header', () => {
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <Header />
    </AuthContext.Provider>,
  )

  expect(screen.getByText('Diary Library')).toBeInTheDocument()
  // logo image
  expect(screen.getByAltText('diary-library-logo')).toBeInTheDocument()

  // custom avatar by user
  expect(screen.getByText('C')).toBeInTheDocument()
})

test('actions on Header', () => {
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <Header />
    </AuthContext.Provider>,
  )
  const userAvatar = screen.getByRole('button')
  fireEvent.click(userAvatar)
  expect(screen.getByText('Edit Account')).toBeInTheDocument()
  expect(screen.getByText('Sign Out')).toBeInTheDocument()

  // mock history
  const logo = screen.getByAltText('diary-library-logo')
  fireEvent.click(logo)
  expect(mockHistoryPush).toHaveBeenCalledWith('/6154a267c2055fd1920a7107/library')
})
