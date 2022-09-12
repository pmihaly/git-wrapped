import { ReadCommitResult } from 'isomorphic-git'

import {
  createFakeCommit,
  createFakeIsomorphicCommit,
  fromIsomorphicGitCommit,
} from '.'

describe('Commit', () => {
  describe('fromIsomorphicGitCommit', () => {
    it('should construct commit from isomophic git commit format', () => {
      const isomorphicGitCommit: ReadCommitResult = createFakeIsomorphicCommit(
        {}
      )

      const mappedCommit = fromIsomorphicGitCommit(isomorphicGitCommit)

      expect(mappedCommit).toEqual(createFakeCommit({}))
    })
  })
})
