import { render } from '@redwoodjs/testing'

import MainForm from './MainForm'

describe('MainForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MainForm />)
    }).not.toThrow()
  })
})
