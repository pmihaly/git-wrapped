import * as NES from 'fp-ts-std/NonEmptyString'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant } from 'fp-ts/function'

import {
  CreateStatisticFrom,
  GitRepo,
  Statistic,
  createFakeGitRepo,
  createFakeStatistic,
  createFakeStatisticCreator,
  wrapGitRepo,
} from '.'

describe('wrapGitRepo', () => {
  it('should create statistics for a git repo', () => {
    const repo = createFakeGitRepo({})
    const stats: RNEA.ReadonlyNonEmptyArray<CreateStatisticFrom<GitRepo>> = [
      createFakeStatisticCreator({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
      createFakeStatisticCreator({
        name: NES.unsafeFromString('Statistic 2'),
        headline: NES.unsafeFromString('Test statistic 2'),
      }),
    ]

    const res = wrapGitRepo(repo)(stats)()

    const expectedResults: RNEA.ReadonlyNonEmptyArray<Statistic> = [
      createFakeStatistic({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
      createFakeStatistic({
        name: NES.unsafeFromString('Statistic 2'),
        headline: NES.unsafeFromString('Test statistic 2'),
      }),
    ]

    expect(res).toStrictEqual(expectedResults)
  })

  it('should omit none statistics', () => {
    const repo = createFakeGitRepo({})
    const noneStatisticCreator = constant(IO.of(O.none))
    const stats: RNEA.ReadonlyNonEmptyArray<CreateStatisticFrom<GitRepo>> = [
      createFakeStatisticCreator({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
      noneStatisticCreator,
    ]

    const res = wrapGitRepo(repo)(stats)()

    const expectedResults = [
      createFakeStatistic({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
    ]

    expect(res).toStrictEqual(expectedResults)
  })
})
