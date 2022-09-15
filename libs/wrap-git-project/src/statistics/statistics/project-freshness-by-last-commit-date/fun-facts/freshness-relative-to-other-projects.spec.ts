import { curry2 } from 'fp-ts-std/Function'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/lib/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { get } from 'spectacles-ts'

import { getFreshnessRelativeToOtherProjectsFunFact } from '.'
import { FunFact } from '../../../statistic'

const getFirstBarchartData = (funFact: FunFact): O.Option<ReadonlyArray<number>> =>
  pipe(
    funFact,
    get('claim.chart.?some.datasets'),
    O.chain(RA.findFirst(flow(get('type'), curry2(S.Eq.equals)('bar')))),
    O.chain(flow(get('data'), O.of))
  )

describe('getFreshnessRelativeToOtherProjectsFunFact', () => {
  it('should contain a barchart representing this project', () => {
    const hasBarChart = (funFact: FunFact) =>
      pipe(funFact, get('claim.chart.?some.datasets.[]>.type'), RA.elem(S.Eq)('bar'))

    const funFact = getFreshnessRelativeToOtherProjectsFunFact()

    expect(hasBarChart(funFact)).toBe(true)
  })

  describe('barchart representing this project', () => {
    it('should contain only ones or zeros', () => {
      const hasBarchartOfOnesOrZeros = flow(
        getFirstBarchartData,
        O.chain(flow(RA.uniq(N.Eq), RA.sort(N.Ord), curry2(RA.getEq(N.Eq).equals)([0, 1]), O.guard)),
        O.isSome
      )

      const funFact = getFreshnessRelativeToOtherProjectsFunFact()

      expect(hasBarchartOfOnesOrZeros(funFact)).toBe(true)
    })

    it('should only have a single instance of 1', () => {
      const numberOfOccurrencesOf = (n: number) => flow(RA.filter(curry2(N.Eq.equals)(n)), RA.size)

      const hasSingleInstanceOf = (n: number) =>
        flow(
          getFirstBarchartData,
          O.chain(flow(numberOfOccurrencesOf(n), O.of)),
          O.chain(flow((curry2(N.Eq.equals)(1), O.of))),
          O.isSome
        )

      const funFact = getFreshnessRelativeToOtherProjectsFunFact()

      expect(hasSingleInstanceOf(1)(funFact)).toBe(true)
    })
    it.todo('should have 1 on the position of the last completed month')
  })
})
