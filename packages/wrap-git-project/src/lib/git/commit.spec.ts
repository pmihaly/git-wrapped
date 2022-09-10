import { some } from 'fp-ts/Option'
import { CommitObject, ReadCommitResult } from 'isomorphic-git'
import {
  fromIsomorphicGitCommit,
  fromIsomorphicGitAuthor,
  fromIsomorphicGitCommitter,
} from '.'

const createIsomorphicCommit = (
  c: Partial<ReadCommitResult>
): ReadCommitResult => ({
  oid: 'test oid',
  commit: {
    message: 'commit message',
    tree: 'commit tree',
    parent: ['parent1', 'parent2'],
    author: createIsomorphicAuthor({}),
    committer: createIsomorphicCommitter({}),
    gpgsig: 'gpg signature',
  },
  payload: 'gpg payload',
  ...c,
})

const createIsomorphicAuthor = (
  a: Partial<CommitObject['author']>
): CommitObject['author'] => ({
  name: 'test author',
  email: 'author@test.com',
  timestamp: 123,
  timezoneOffset: 123,
  ...a,
})

const createIsomorphicCommitter = (
  c: Partial<CommitObject['committer']>
): CommitObject['committer'] => ({
  ...createIsomorphicAuthor({
    name: 'test committer',
    email: 'committer@test.com',
  }),
  ...c,
})

describe('Commit', () => {
  describe('fromIsomorphicGitCommit', () => {
    it('should construct commit from isomophic git commit format', () => {
      const isomorphicGitCommit: ReadCommitResult = createIsomorphicCommit({})

      const mappedCommit = fromIsomorphicGitCommit(isomorphicGitCommit)

      expect(mappedCommit).toEqual(
        expect.objectContaining({
          hash: 'test oid',
          message: 'commit message',
          tree: 'commit tree',
          parent: ['parent1', 'parent2'],
          gpgSignature: some('gpg signature'),
        })
      )
    })
  })

  describe('fromIsomorphicGitAuthor', () => {
    it('should construct author from isomophic git commit format', () => {
      const isomorphicGitAuthor = createIsomorphicAuthor({})

      const mappedAuthor = fromIsomorphicGitAuthor(isomorphicGitAuthor)

      expect(mappedAuthor).toEqual({
        name: 'test author',
        email: 'author@test.com',
        writtenAt: new Date('1970-01-01T00:02:03.000Z'),
      })
    })
  })

  describe('fromIsomorphicGitCommitter', () => {
    it('should construct committer from isomophic git commit format', () => {
      const isomorphicGitCommitter = createIsomorphicCommitter({})

      const mappedCommitter = fromIsomorphicGitCommitter(isomorphicGitCommitter)

      expect(mappedCommitter).toStrictEqual({
        name: 'test committer',
        email: 'committer@test.com',
        committedAt: new Date('1970-01-01T00:02:03.000Z'),
      })
    })
  })
})
