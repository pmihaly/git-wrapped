import { differenceInDays } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as NS from 'fp-ts-std/Number'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { get } from 'spectacles-ts'

import { CreateStatisticFrom } from '..'
import { GitRepo } from '../..'

type DayRangesToFreshness = ReadonlyArray<{
  range: { min: number; max: number }
  label: string
}>

const dayRangesToFreshness: DayRangesToFreshness = [
  { range: { min: 0, max: 14 }, label: 'as fresh as a banana in the store' }, // https://www.theguardian.com/lifeandstyle/2003/jul/13/foodanddrink.features18
  { range: { min: 18, max: 30 }, label: 'as fresh as a housefly' }, // https://a-z-animals.com/blog/fly-lifespan-how-long-do-flies-live/
  { range: { min: 30, max: 90 }, label: 'as fresh as a UHT milk can be' }, // https://foodsafety.foodscience.cornell.edu/sites/foodsafety.foodscience.cornell.edu/files/shared/documents/CU-DFScience-Notes-Milk-Pasteurization-UltraP-10-10.pdf
  { range: { min: 14, max: 35 }, label: 'as fresh as eggs can be' }, //https://ask.usda.gov/s/article/How-long-can-you-store-eggs-in-the-refrigerator
]

export type ProjectFreshnessByLastCommitDate = CreateStatisticFrom<GitRepo>
export const projectFreshnessByLastCommitDate = (currentDate: Date): ProjectFreshnessByLastCommitDate =>
  flow(
    O.of,
    O.bindTo('repo'),
    O.bind('lastCommitDate', ({ repo }) => pipe(repo.commits, RA.last, O.map(get('committer.committedAt')))),
    O.bind('projectFreshness', ({ lastCommitDate }) =>
      calculateProjectFreshness(dayRangesToFreshness)(currentDate)(lastCommitDate)
    ),
    O.bind('daysSinceLastCommit', ({ lastCommitDate }) => O.of(differenceInDays(currentDate, lastCommitDate))),
    O.chain(({ daysSinceLastCommit, projectFreshness }) =>
      O.of({
        name: NES.unsafeFromString('Project freshness by last commit date'),
        headline: NES.unsafeFromString(`Your project is **${projectFreshness}**`),
        description: O.none,
        funFacts: [
          {
            fact: NES.unsafeFromString(
              `A banana's shelf life in the fridge is about **7–10 days**. Your project outlives at least ${calculateBananaGenerations(
                daysSinceLastCommit
              ).toFixed(1)} refrigerated banana-generations.`
            ),
            source: NES.unsafeFromString('https://www.doesitgobad.com/banana-go-bad'),
          },
        ],
        charts: [],
      })
    )
  )

export const calculateBananaGenerations = NS.divide(10)

export type CalculateProjectFreshness = (
  dayRangesToFreshness: DayRangesToFreshness
) => (currentDate: Date) => (lastCommitDate: Date) => O.Option<string>
export const calculateProjectFreshness: CalculateProjectFreshness =
  (dayRangesToFreshness) => (currentDate) => (lastCommitDate) =>
    pipe(
      dayRangesToFreshness,
      RA.findFirstMap(({ range: { min, max }, label: s }) =>
        RA.elem(N.Eq)(differenceInDays(currentDate, lastCommitDate))(RNEA.range(min, max)) ? O.some(s) : O.none
      )
    )
