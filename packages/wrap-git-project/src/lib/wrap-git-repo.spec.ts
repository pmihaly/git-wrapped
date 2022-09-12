import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, pipe } from 'fp-ts/function'

import {
  CreateStatisticFrom,
  GitRepo,
  createFakeGitRepo,
  createFakeStatistic,
  createFakeStatisticCreator,
  wrapGitRepo,
} from '.'

describe('wrapGitRepo', () => {
  it('should create statistics for a git repo', () => {
    const repo = createFakeGitRepo({})
    const stats = pipe(
      createFakeStatisticCreator({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
      RNEA.of,
      RA.append(
        createFakeStatisticCreator({
          name: NES.unsafeFromString('Statistic 2'),
          headline: NES.unsafeFromString('Test statistic 2'),
        })
      )
    )

    const res = wrapGitRepo(repo)(stats)

    const expectedResults = pipe(
      createFakeStatistic({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
      RNEA.of,
      RA.append(
        createFakeStatistic({
          name: NES.unsafeFromString('Statistic 2'),
          headline: NES.unsafeFromString('Test statistic 2'),
        })
      )
    )

    expect(res).toStrictEqual(expectedResults)
  })

  it('should omit none statistics', () => {
    const repo = createFakeGitRepo({})
    const createNoneStatistic: CreateStatisticFrom<GitRepo> = constant(O.none)
    const stats = pipe(
      createFakeStatisticCreator({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      }),
      RNEA.of,
      RA.append(createNoneStatistic)
    )

    const res = wrapGitRepo(repo)(stats)

    const expectedResults = RA.of(
      createFakeStatistic({
        name: NES.unsafeFromString('Statistic 1'),
        headline: NES.unsafeFromString('Test statistic 1'),
      })
    )
    expect(res).toStrictEqual(expectedResults)
  })
})
