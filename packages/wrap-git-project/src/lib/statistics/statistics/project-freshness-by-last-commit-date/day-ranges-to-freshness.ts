import { differenceInDays } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as NS from 'fp-ts-std/Number'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { get } from 'spectacles-ts'

import { Chart, FunFact } from '../..'

export type DayRangesToFreshness = ReadonlyArray<{
  range: { min: number; max: number }
  freshness: {
    label: NES.NonEmptyString
    description: O.Option<NES.NonEmptyString>
    buildFunFacts: (x: { daysSinceLastCommit: number }) => ReadonlyArray<FunFact>
    charts: ReadonlyArray<Chart>
  }
}>

export const buildBananaGenerationsFunFact = (daysSinceLastCommit: number): FunFact => ({
  fact: NES.unsafeFromString(
    `A banana's shelf life in the fridge is about **7–10 days**. Your project outlives at least ${calculateBananaGenerations(
      daysSinceLastCommit
    ).toFixed(1)} refrigerated banana-generations.`
  ),
  source: NES.unsafeFromString('https://www.doesitgobad.com/banana-go-bad'),
})
const calculateBananaGenerations = NS.divide(10)

export const dayRangesToFreshness: DayRangesToFreshness = [
  {
    range: { min: 0, max: 14 },
    freshness: {
      label: NES.unsafeFromString('as fresh as a banana in the store'),
      description: O.of(
        NES.unsafeFromString('Source: https://www.theguardian.com/lifeandstyle/2003/jul/13/foodanddrink.features18')
      ),
      buildFunFacts: flow(get('daysSinceLastCommit'), RA.of, RA.map(buildBananaGenerationsFunFact)),
      charts: [],
    },
  },
  {
    range: { min: 18, max: 30 },
    freshness: {
      label: NES.unsafeFromString('as fresh as a housefly'),
      description: O.of(
        NES.unsafeFromString('Source: https://a-z-animals.com/blog/fly-lifespan-how-long-do-flies-live/')
      ),
      buildFunFacts: constant([]),
      charts: [],
    },
  },
  {
    range: { min: 30, max: 90 },
    freshness: {
      label: NES.unsafeFromString('as fresh as a UHT milk can be'),
      description: O.of(
        NES.unsafeFromString(
          'Source: https://foodsafety.foodscience.cornell.edu/sites/foodsafety.foodscience.cornell.edu/files/shared/documents/CU-DFScience-Notes-Milk-Pasteurization-UltraP-10-10.pdf'
        )
      ),
      buildFunFacts: constant([]),
      charts: [],
    },
  },
  {
    range: { min: 14, max: 35 },
    freshness: {
      label: NES.unsafeFromString('as fresh as eggs can be'),
      description: O.of(
        NES.unsafeFromString('Source: https://ask.usda.gov/s/article/How-long-can-you-store-eggs-in-the-refrigerator')
      ),
      buildFunFacts: constant([]),
      charts: [],
    },
  },
]

export type CalculateProjectFreshness = (
  dayRangesToFreshness: DayRangesToFreshness
) => (currentDate: Date) => (lastCommittedAt: Date) => O.Option<DayRangesToFreshness[number]['freshness']>
export const calculateProjectFreshness: CalculateProjectFreshness =
  (dayRangesToFreshness) => (currentDate) => (lastCommittedAt) =>
    pipe(
      dayRangesToFreshness,
      RA.findFirstMap(({ range: { min, max }, freshness: s }) =>
        RA.elem(N.Eq)(differenceInDays(currentDate, lastCommittedAt))(RNEA.range(min, max)) ? O.some(s) : O.none
      )
    )
