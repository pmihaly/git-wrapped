import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { GradientMarkdownText } from '.'

const gradient = '45deg, $purple600 -20%, $pink600 100%'

describe('GradientMarkdownText', () => {
  it('should render the given text', () => {
    const { baseElement } = render(<GradientMarkdownText textGradient={gradient}>test</GradientMarkdownText>)

    expect(baseElement).toHaveTextContent('test')
  })

  it('should wrap bold into gradient text', () => {
    render(
      <GradientMarkdownText textGradient={gradient} gradientTextProps={{ role: 'presentation' }}>
        text **bold text** text
      </GradientMarkdownText>
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('bold text')
  })

  it('should let customization of the normal text props', () => {
    const { baseElement } = render(
      <GradientMarkdownText textGradient={gradient} normalTextProps={{ role: 'presentation' }}>
        text **bold text** text
      </GradientMarkdownText>
    )

    expect(screen.getByRole('presentation').textContent).toStrictEqual(baseElement.textContent)
  })

  it('should let customization of all text props', () => {
    render(
      <GradientMarkdownText textGradient={gradient} textProps={{ role: 'presentation' }}>
        text **bold text** text
      </GradientMarkdownText>
    )

    expect(screen.getAllByRole('presentation').length).toBe(2)
  })

  it('should make gradient bold by default', () => {
    const { container } = render(
      <GradientMarkdownText textGradient={gradient}>text **bold text** text</GradientMarkdownText>
    )

    expect(container.querySelector('b')?.textContent).toBe('bold text')
  })
})
