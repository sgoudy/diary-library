import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import App from '../App.js'

test('renders Welcome text', () => {
  render(<App />)
  const linkElement = screen.getByText('Welcome to the Diary Library')
  expect(linkElement).toBeInTheDocument()
})
