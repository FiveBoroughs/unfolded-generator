import { render } from '@redwoodjs/testing'

import FlashMessages from './FlashMessages'

describe('FlashMessages', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FlashMessages />)
    }).not.toThrow()
  })
})
