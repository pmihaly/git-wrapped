import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, identity, pipe } from 'fp-ts/function'
import { isLeft } from 'fp-ts/lib/Either'

import {
  Commit,
  createIsomorphicCommit,
  fromIsomorphicGit,
  fromIsomorphicGitCommit,
} from '.'

describe('GitInteractor', () => {
  describe('log', () => {
    describe('fromIsomorphicGit', () => {
      it('should return taskEither of list of commits', async () => {
        const fs: any = {}
        const gitDir = '.'

        const isomorphicCommit = createIsomorphicCommit({})
        const commit = fromIsomorphicGitCommit(isomorphicCommit)

        const isomorphicGit: any = {
          log: jest.fn().mockResolvedValue([isomorphicCommit]),
        }

        const errorOrCommits = await pipe(
          fromIsomorphicGit(isomorphicGit)(fs)(gitDir),
          (x) => x.log()
        )()

        expect(E.isRight(errorOrCommits)).toBeTruthy
        expect(
          E.getOrElse<string, ReadonlyArray<Commit>>(
            constant(RA.fromArray([]))
          )(errorOrCommits)
        ).toStrictEqual([commit])
      })

      it('should return taskEither error string', async () => {
        const fs: any = {}
        const gitDir = '.'

        const errorMessage = 'error'

        const isomorphicGit: any = {
          log: jest.fn().mockRejectedValue(errorMessage),
        }

        const errorOrCommits = await pipe(
          fromIsomorphicGit(isomorphicGit)(fs)(gitDir),
          (x) => x.log()
        )()

        expect(isLeft(errorOrCommits)).toBeTruthy
        expect(
          E.match<string, ReadonlyArray<Commit>, string>(
            identity,
            constant('not error returned')
          )(errorOrCommits)
        ).toEqual(errorMessage)
      })
    })
  })
})
