import { differenceInDays } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'

import { WithSource } from '../..'

export type DayRangesToFreshness = ReadonlyArray<{
  range: { min: number; max: number }
  freshness: WithSource<NES.NonEmptyString>
}>

export const dayRangesToFreshness: DayRangesToFreshness = [
  {
    range: { min: 0, max: 14 },
    freshness: {
      claim: NES.unsafeFromString('as fresh as a banana in the store'),
      source: NES.unsafeFromString(
        'Source: https://www.theguardian.com/lifeandstyle/2003/jul/13/foodanddrink.features18'
      ),
    },
  },
  {
    range: { min: 18, max: 30 },
    freshness: {
      claim: NES.unsafeFromString('as fresh as a housefly'),
      source: NES.unsafeFromString('Source: https://a-z-animals.com/blog/fly-lifespan-how-long-do-flies-live/'),
    },
  },
  {
    range: { min: 30, max: 90 },
    freshness: {
      claim: NES.unsafeFromString('as fresh as a UHT milk can be'),
      source: NES.unsafeFromString(
        'Source: https://foodsafety.foodscience.cornell.edu/sites/foodsafety.foodscience.cornell.edu/files/shared/documents/CU-DFScience-Notes-Milk-Pasteurization-UltraP-10-10.pdf'
      ),
    },
  },
  {
    range: { min: 14, max: 35 },
    freshness: {
      claim: NES.unsafeFromString('as fresh as eggs can be'),
      source: NES.unsafeFromString(
        'Source: https://ask.usda.gov/s/article/How-long-can-you-store-eggs-in-the-refrigerator'
      ),
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
