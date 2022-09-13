import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'

import { DayRangesToFreshness, buildBananaGenerationsFunFact, calculateProjectFreshness } from '.'

describe('calculateProjectFreshness', () => {
  it('should calculate freshness matching the range', () => {
    const daysToFreshness: DayRangesToFreshness = [
      {
        range: { min: 0, max: 1 },
        freshness: {
          label: NES.unsafeFromString('too fresh'),
          description: O.none,
          buildFunFacts: () => [],
          charts: [],
        },
      },
      {
        range: { min: 2, max: 4 },
        freshness: {
          label: NES.unsafeFromString('just right'),
          description: O.none,
          buildFunFacts: () => [],
          charts: [],
        },
      },
      {
        range: { min: 5, max: 100 },
        freshness: {
          label: NES.unsafeFromString('just right'),
          description: O.none,
          buildFunFacts: () => [],
          charts: [],
        },
      },
    ]

    const currentDate = new Date(2012, 1, 4)
    const lastCommitDate = new Date(2012, 1, 1)

    const freshness = calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

    expect(O.isSome(freshness)).toBe(true)
  })

  it('should return none when has no matching range', () => {
    const daysToFreshness: DayRangesToFreshness = [
      {
        range: { min: 0, max: 1 },
        freshness: {
          label: NES.unsafeFromString('too fresh'),
          description: O.none,
          buildFunFacts: () => [],
          charts: [],
        },
      },
      {
        range: { min: 2, max: 4 },
        freshness: {
          label: NES.unsafeFromString('just right'),
          description: O.none,
          buildFunFacts: () => [],
          charts: [],
        },
      },
      {
        range: { min: 5, max: 100 },
        freshness: {
          label: NES.unsafeFromString('just right'),
          description: O.none,
          buildFunFacts: () => [],
          charts: [],
        },
      },
    ]

    const currentDate = new Date(2012, 1, 1)
    const lastCommitDate = new Date(2012, 5, 31) // may 5 - jan 1 = 150 days

    const freshness = calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

    expect(O.isNone(freshness)).toBe(true)
  })
})

describe('buildBananaGenerationsFunFact', () => {
  it('should calculate outlived banana generations', () => {
    const daysSinceLastCommit = 100

    const bananaGenerationsFact = buildBananaGenerationsFunFact(daysSinceLastCommit).claim

    expect(NES.toString(bananaGenerationsFact)).toContain('10')
  })
})
