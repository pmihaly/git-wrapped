import { createFakeStatistic } from '@git-wrapped/wrap-git-project'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as NES from 'fp-ts-std/NonEmptyString'
import { flow } from 'fp-ts/lib/function'
import * as S from 'fp-ts/string'

import { Statistic } from '.'
import { createFakeTheme } from '../theme'

const fromMarkdownNES = flow(NES.toString, S.replace(/\*\*/g, ''))

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
})
