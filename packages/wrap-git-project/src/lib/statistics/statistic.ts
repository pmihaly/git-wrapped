import * as O from 'fp-ts/Option'
import { constant } from 'fp-ts/function'

import { Chart, GitRepo, StatisticHeadline, createFakeChart } from '..'

export type CreateStatisticFrom<T> = (t: T) => O.Option<Statistic>

export type Statistic = {
  name: string
  headline: StatisticHeadline
  charts: ReadonlyArray<Chart>
}

export const createFakeStatistic = (s: Partial<Statistic>): Statistic => ({
  name: 'Test statistic',
  headline: 'Test statistic with **a value**',
  charts: [createFakeChart({})],
  ...s,
})

export const createFakeStatisticCreator = (
  s: Partial<Statistic>
): CreateStatisticFrom<GitRepo> => constant(O.some(createFakeStatistic(s)))
