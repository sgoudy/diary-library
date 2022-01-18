import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import AddBook from '../components/AddBook/index.jsx'
import { AuthContext } from '../context/AuthContext.js'
import { testUser } from './resources/userFixtures.js'

test('modal shows the children and a close button', () => {
  const openNewBook = true
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <AddBook open={openNewBook} />
    </AuthContext.Provider>,
  )
  expect(screen.getByText('Add New Book')).toBeInTheDocument()

  // close button
  const closeBtn = screen.getAllByRole('button')[0]
  expect(closeBtn).toBeInTheDocument()

  // add button
  const addBtn = screen.getAllByRole('button')[1]
  expect(addBtn).toBeInTheDocument()

  // check for book input
  const contentInput = screen.getByTestId('add-book-input')
  fireEvent.change(contentInput, {
    target: { value: 'test' },
  })

  expect(screen.getByDisplayValue('test')).toBeInTheDocument()
})
