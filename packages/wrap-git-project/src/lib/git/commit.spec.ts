import { some } from 'fp-ts/Option'
import { ReadCommitResult } from 'isomorphic-git'

import {
  createIsomorphicAuthor,
  createIsomorphicCommit,
  createIsomorphicCommitter,
  fromIsomorphicGitAuthor,
  fromIsomorphicGitCommit,
  fromIsomorphicGitCommitter,
} from '.'

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
