import { createFakeStatistic } from '@git-wrapped/wrap-git-project'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import { constant, flow } from 'fp-ts/lib/function'
import * as S from 'fp-ts/string'

import { Statistic } from '.'
import { createFakeTheme } from '../theme'

const fromMarkdownNES = flow(NES.toString, S.replace(/\*\*/g, ''))
const fromOptionMarkdownNES = flow(O.getOrElse(constant(NES.unsafeFromString('no text defined'))), fromMarkdownNES)

describe('Statistic', () => {
  it('should display the heading', () => {
    const statistic = createFakeStatistic({})

    render(
      <Statistic
        theme={createFakeTheme({})}
        statistic={statistic}
        headlineProps={{ normalTextProps: { role: 'presentation' } }}
      />
    )

    expect(screen.getByRole('presentation')).toHaveTextContent(fromMarkdownNES(statistic.headline))
  })

  it('should display the text if given', () => {
    const statistic = createFakeStatistic({ text: O.some(NES.unsafeFromString('test text')) })

    render(
      <Statistic
        theme={createFakeTheme({})}
        statistic={statistic}
        textProps={{ normalTextProps: { role: 'presentation' } }}
      />
    )

    expect(screen.getByRole('presentation')).toHaveTextContent(fromOptionMarkdownNES(statistic.text))
  })

  it('should not display the text if not given', () => {
    const statistic = createFakeStatistic({ text: O.none })

    render(
      <Statistic
        theme={createFakeTheme({})}
        statistic={statistic}
        textProps={{ normalTextProps: { role: 'presentation' } }}
      />
    )

    expect(screen.queryByRole('presentation')).toBeNull()
  })
})
