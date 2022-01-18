import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import AddCollection from '../components/AddCollection/index.jsx'
import { AuthContext } from '../context/AuthContext.js'
import { testUser } from './resources/userFixtures.js'

test('renders Edit Account page', () => {
  const openAddCollection = true
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <AddCollection open={openAddCollection} />
    </AuthContext.Provider>,
  )
  expect(screen.getByText('Add New Collection')).toBeInTheDocument()

  // close button
  const closeBtn = screen.getAllByRole('button')[0]
  expect(closeBtn).toBeInTheDocument()

  // add button
  const addBtn = screen.getAllByRole('button')[1]
  expect(addBtn).toBeInTheDocument()

  // check for collection input
  const contentInput = screen.getByTestId('add-collection-input')
  fireEvent.change(contentInput, {
    target: { value: 'test' },
  })

  expect(screen.getByDisplayValue('test')).toBeInTheDocument()
})
