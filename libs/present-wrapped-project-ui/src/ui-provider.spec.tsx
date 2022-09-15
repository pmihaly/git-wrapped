import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { UiProvider } from '.'

describe('UiProvider', () => {
  it('should render children successfully', () => {
    const providedElement = (
      <UiProvider>
        <p role="presentation">test</p>
      </UiProvider>
    )
    render(providedElement)

    expect(screen.getByRole('presentation')).toHaveTextContent('test')
  })
})
