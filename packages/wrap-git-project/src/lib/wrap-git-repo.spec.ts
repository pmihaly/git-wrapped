import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, pipe } from 'fp-ts/function'

import {
  CreateStatisticFrom,
  GitRepo,
  createFakeGitRepo,
  createFakeStatistic,
  wrapGitRepo,
} from '.'

describe('wrapGitRepo', () => {
  it('should create statistics for a git repo', () => {
    const repo = createFakeGitRepo({})
    const stats = pipe(
      createFakeStatistic({
        name: 'Statistic 1',
        headline: 'Test statistic 1',
      }),
      RNEA.of,
      RA.append(
        createFakeStatistic({
          name: 'Statistic 2',
          headline: 'Test statistic 2',
        })
      )
    )

    const res = wrapGitRepo(repo)(stats)

    const expectedResults = pipe(
      {
        name: 'Statistic 1',
        headline: 'Test statistic 1',
      },
      RNEA.of,
      RA.append({
        name: 'Statistic 2',
        headline: 'Test statistic 2',
      })
    )

    expect(res).toStrictEqual(expectedResults)
  })

  it('should omit none statistics', () => {
    const repo = createFakeGitRepo({})
    const createNoneStatistic: CreateStatisticFrom<GitRepo> = constant(O.none)
    const stats = pipe(
      createFakeStatistic({
        name: 'Statistic 1',
        headline: 'Test statistic 1',
      }),
      RNEA.of,
      RA.append(createNoneStatistic)
    )

    const res = wrapGitRepo(repo)(stats)

    const expectedResults = RA.of({
      name: 'Statistic 1',
      headline: 'Test statistic 1',
    })
    expect(res).toStrictEqual(expectedResults)
  })
})
