import * as O from 'fp-ts/Option'

import { calculateProjectFreshness } from '.'

describe('ProjectFreshnessByLastCommitDate', () => {
  describe('calculateProjectFreshness', () => {
    it('should calculate freshness matching the range', () => {
      const daysToFreshness = [
        { range: { min: 0, max: 1 }, label: 'too fresh' },
        { range: { min: 2, max: 4 }, label: 'just right' },
        { range: { min: 5, max: 100 }, label: 'too stale' },
      ]

      const currentDate = new Date(2012, 1, 4)
      const lastCommitDate = new Date(2012, 1, 1)

      const freshness =
        calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

      expect(freshness).toStrictEqual(O.some('just right'))
    })

    it('should return none when has no matching range', () => {
      const daysToFreshness = [
        { range: { min: 0, max: 1 }, label: 'too fresh' },
        { range: { min: 2, max: 4 }, label: 'just right' },
        { range: { min: 5, max: 100 }, label: 'too stale' },
      ]

      const currentDate = new Date(2012, 1, 1)
      const lastCommitDate = new Date(2012, 5, 31) // may 5 - jan 1 = 150 days

      const freshness =
        calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

      expect(freshness).toStrictEqual(O.none)
    })
  })
})
