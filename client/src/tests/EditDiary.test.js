import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import { AuthContext } from '../context/AuthContext.js'
import EditDiary from '../components/EditDiary/index.jsx'

import { mockCollections } from './resources/collectionsFixtures.js'
import { testUser } from './resources/userFixtures.js'

test('renders Edit Account page', () => {
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <EditDiary coll={mockCollections?.collections} collid={0} id={0}/>
    </AuthContext.Provider>,
  )

  // back button & edit button
  expect(screen.getByText('Back to Books')).toBeInTheDocument()
  expect(screen.getByText('Edit')).toBeInTheDocument()

  // hitting edit book
  fireEvent.click(screen.getByText('Edit'))
  expect(screen.getByText('Delete Book')).toBeInTheDocument()
  expect(screen.getByText('Save')).toBeInTheDocument()

  // check for title input
  const contentInput = screen.getByTestId('title-input')
  fireEvent.change(contentInput, {
    target: { value: 'test' },
  })

  expect(screen.getByDisplayValue('test')).toBeInTheDocument()

  // check for quill
  expect(screen.getByTitle('editor')).toBeInTheDocument()
})
