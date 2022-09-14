import * as SIO from 'fp-ts-std/IO'
import * as ST from 'fp-ts-std/Task'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, identity, pipe } from 'fp-ts/function'
import * as isomorphicGit from 'isomorphic-git'
import { get } from 'spectacles-ts'

import { Commit, createFakeIsomorphicCommit, fromIsomorphicGit, fromIsomorphicGitCommit } from '.'

describe('Git', () => {
  describe('log', () => {
    describe('fromIsomorphicGit', () => {
      it('should return taskEither of list of commits', async () => {
        const fs = {} as unknown as isomorphicGit.PromiseFsClient
        const gitDir = '.'

        const isomorphicCommit = createFakeIsomorphicCommit({})
        const commit = fromIsomorphicGitCommit(isomorphicCommit)

        const git = {
          log: jest.fn().mockResolvedValue([isomorphicCommit]),
        } as unknown as typeof isomorphicGit

        const errorOrCommits = await pipe(fromIsomorphicGit(git)(fs)(gitDir), get('log'), SIO.execute, ST.execute)

        expect(E.isRight(errorOrCommits)).toBeTruthy
        expect(E.getOrElse<string, ReadonlyArray<Commit>>(constant(RA.fromArray([])))(errorOrCommits)).toStrictEqual([
          commit,
        ])
      })

      it('should return taskEither error string', async () => {
        const fs = {} as unknown as isomorphicGit.PromiseFsClient
        const gitDir = '.'

        const errorMessage = 'error'

        const git = {
          log: jest.fn().mockRejectedValue(errorMessage),
        } as unknown as typeof isomorphicGit

        const errorOrCommits = await pipe(fromIsomorphicGit(git)(fs)(gitDir), get('log'), SIO.execute, ST.execute)

        expect(E.isLeft(errorOrCommits)).toBeTruthy
        expect(
          E.match<string, ReadonlyArray<Commit>, string>(identity, constant('not error returned'))(errorOrCommits)
        ).toEqual(errorMessage)
      })
    })
  })
})
