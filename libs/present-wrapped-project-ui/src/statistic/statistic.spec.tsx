import { createFakeFunFact, createFakeStatistic } from '@git-wrapped/wrap-git-project'
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
  describe('heading', () => {
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

  describe('text', () => {
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

  describe('fun facts', () => {
    it('should display all fun facts', () => {
      const statistic = createFakeStatistic({
        funFacts: [
          createFakeFunFact({
            claim: {
              headline: NES.fromString('Fun fact headline 1'),
              text: NES.fromString('Fun fact text 1'),
              chart: O.none,
            },
          }),
          createFakeFunFact({
            claim: {
              headline: NES.fromString('Fun fact headline 2'),
              text: O.none,
              chart: O.none,
            },
          }),
        ],
      })

      render(
        <Statistic
          theme={createFakeTheme({})}
          statistic={statistic}
          funFactsProps={{ headlineProps: { textProps: { role: 'presentation' } } }}
        />
      )

      const funFactHeadlines = screen.getAllByRole('presentation').map((x) => x.textContent)

      expect(funFactHeadlines).toStrictEqual(['Fun fact headline 1', 'Fun fact headline 2'])
    })
  })
})
