import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import { UiProvider } from '.'

describe('UiProvider', () => {
  it('should render children successfully', async () => {
    render(
      <UiProvider>
        <p role="presentation">test</p>
      </UiProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('presentation')).toHaveTextContent('test')
    })
  })
})
