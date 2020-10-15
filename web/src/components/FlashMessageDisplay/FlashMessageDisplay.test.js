import { render } from '@redwoodjs/testing'

import FlashMessageDisplay from './FlashMessageDisplay'

describe('FlashMessageDisplay', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FlashMessageDisplay />)
    }).not.toThrow()
  })
})
