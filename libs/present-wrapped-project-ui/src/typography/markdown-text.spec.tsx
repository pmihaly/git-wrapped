import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'

import { MarkdownText } from '.'

const createNormal =
  (role?: 'presentation') =>
  ({ children }: { children: ReactNode }) =>
    <p role={role}>{children}</p>

const createBold =
  (role?: 'presentation') =>
  ({ children }: { children: ReactNode }) =>
    <strong role={role}>{children}</strong>

describe('MarkdownText', () => {
  it('should contain input text', () => {
    const { baseElement } = render(
      <MarkdownText bold={createBold()} normal={createNormal()}>
        test
      </MarkdownText>
    )

    expect(baseElement).toHaveTextContent('test')
  })

  it('should wrap bold with given component', () => {
    render(
      <MarkdownText bold={createBold('presentation')} normal={createNormal()}>
        text **bold text** text
      </MarkdownText>
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('bold text')
  })

  it('should wrap normal text with given component', () => {
    render(
      <MarkdownText bold={createBold()} normal={createNormal('presentation')}>
        text **bold text** text
      </MarkdownText>
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('text bold text text')
  })
})
