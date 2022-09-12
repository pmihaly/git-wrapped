import * as O from 'fp-ts/Option'
import { constant } from 'fp-ts/function'

import { GitRepo, StatisticHeadline } from '..'

export type CreateStatisticFrom<T> = (t: T) => O.Option<Statistic>

export type Statistic = {
  name: string
  headline: StatisticHeadline
}

export const createStubStatistic = (
  s: Partial<Statistic>
): CreateStatisticFrom<GitRepo> =>
  constant(
    O.some({
      name: 'Test statistic',
      headline: 'Test statistic with **a value**',
      ...s,
    })
  )
