import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import { constant } from 'fp-ts/function'

import { Chart, GitRepo, createFakeChart } from '..'

export type Statistic = {
  name: NES.NonEmptyString
  headline: NES.NonEmptyString
  description: O.Option<NES.NonEmptyString>
  charts: ReadonlyArray<Chart>
}

export const createFakeStatistic = (s: Partial<Statistic>): Statistic => ({
  name: NES.unsafeFromString('Test statistic'),
  headline: NES.unsafeFromString('Test statistic with **a value**'),
  description: O.some(NES.unsafeFromString('Test description')),
  charts: [createFakeChart({})],
  ...s,
})

export type CreateStatisticFrom<T> = (t: T) => O.Option<Statistic>

export const createFakeStatisticCreator = (
  s: Partial<Statistic>
): CreateStatisticFrom<GitRepo> => constant(O.some(createFakeStatistic(s)))
