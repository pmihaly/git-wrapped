import * as NES from 'fp-ts-std/NonEmptyString'
import * as IOO from 'fp-ts/IOOption'
import * as O from 'fp-ts/Option'
import { constant, flow } from 'fp-ts/function'

import { Chart, GitRepo, createFakeChart } from '..'

export type WithSource<T> = {
  claim: T
  source: NES.NonEmptyString
}

const withFakeSource =
  (source: NES.NonEmptyString = NES.unsafeFromString('test source')) =>
  <T>(claim: T): WithSource<T> => ({
    claim,
    source,
  })

export type FunFact = WithSource<NES.NonEmptyString>

export type Statistic = {
  name: NES.NonEmptyString
  headline: NES.NonEmptyString
  description: O.Option<NES.NonEmptyString>
  funFacts: ReadonlyArray<FunFact>
  charts: ReadonlyArray<WithSource<Chart>>
}

export const createFakeStatistic = (s: Partial<Statistic>): Statistic => ({
  name: NES.unsafeFromString('Test statistic'),
  headline: NES.unsafeFromString('Test statistic with **a value**'),
  description: O.some(NES.unsafeFromString('Test description')),
  funFacts: [
    {
      claim: NES.unsafeFromString('Test fact 1'),
      source: NES.unsafeFromString('https://example.com/fact1'),
    },
    {
      claim: NES.unsafeFromString('Test fact 2'),
      source: NES.unsafeFromString('https://example.com/fact2'),
    },
  ],
  charts: [withFakeSource()(createFakeChart({}))],
  ...s,
})

export type CreateStatisticFrom<T> = (t: T) => IOO.IOOption<Statistic>

export const createFakeStatisticCreator: (s: Partial<Statistic>) => CreateStatisticFrom<GitRepo> = flow(
  createFakeStatistic,
  IOO.of,
  constant
)
