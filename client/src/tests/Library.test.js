import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AuthContext } from '../context/AuthContext.js'
import Library from '../components/Library/index.jsx'
import { mockCollections } from './resources/collectionsFixtures.js'
import nock from 'nock'
import { testUser } from './resources/userFixtures.js'

// CAN ONLY RUN THIS LOCALLY WITH BACKEND SERVER RUNNING (3001)
// test is currently being skipped, to run uncomment .only on the other tests in this file
test.skip('renders Library Page with first collection and books', async () => {
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <Library />
    </AuthContext.Provider>,
  )

  expect(screen.getByText('Collections')).toBeInTheDocument()
  expect(screen.getByText('Edit')).toBeInTheDocument()
  expect(screen.getByText('New Collection')).toBeInTheDocument()

  expect(screen.getByText('NEW BOOK')).toBeInTheDocument()

  // mock api call
  const scope = nock('http://localhost:3001/api')
    .get('/collections/6154a267c2055fd1920a7107')
    .once()
    .reply(200, {
      data: mockCollections,
    })

  await waitFor(() => screen.getAllByText('New Col 1'))

  // collection name in panel
  expect(screen.getAllByText('New Col 1')[0]).toBeInTheDocument()
  // other collections in left panel
  expect(screen.getByText('Test Col B')).toBeInTheDocument()
  expect(screen.getByText('Test Col 3')).toBeInTheDocument()

  // collection in page
  expect(screen.getAllByText('New Col 1')[1]).toBeInTheDocument()

  // books in the first collection
  expect(screen.getByText('BAZINGA BOOK!')).toBeInTheDocument()
  expect(screen.getByText('Book 3 Duh')).toBeInTheDocument()

  // clicking on other collections
  fireEvent.click(screen.getByText('Test Col B'))
  expect(screen.getByText('Another book!')).toBeInTheDocument()

  // clicking on a book
  fireEvent.click(screen.getAllByText('New Col 1')[0])
  fireEvent.click(screen.getByText('BAZINGA BOOK!'))
  expect(screen.getByText('BAZINGA BOOK!')).toBeInTheDocument()
  expect(screen.getByText('Back to Library')).toBeInTheDocument()
  expect(screen.getByText('Edit Book')).toBeInTheDocument()
})

test.skip('edit mode for Collections', () => {
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <Library />
    </AuthContext.Provider>,
  )

  const editCollections = screen.getByText('Edit')
  fireEvent.click(editCollections)
  expect(screen.getByText('Save')).toBeInTheDocument()
})

test.skip('add new book', () => {
  render(
    <AuthContext.Provider
      value={{
        user: testUser,
        isAuthenticated: true,
      }}
    >
      <Library />
    </AuthContext.Provider>,
  )

  const addBook = screen.getByText('NEW BOOK')
  fireEvent.click(addBook)
  expect(screen.getByText('Add New Book')).toBeInTheDocument()
})
