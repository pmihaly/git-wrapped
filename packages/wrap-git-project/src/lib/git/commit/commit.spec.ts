import { ReadCommitResult } from 'isomorphic-git'

import {
  createCommit,
  createIsomorphicCommit,
  fromIsomorphicGitCommit,
} from '.'

describe('Commit', () => {
  describe('fromIsomorphicGitCommit', () => {
    it('should construct commit from isomophic git commit format', () => {
      const isomorphicGitCommit: ReadCommitResult = createIsomorphicCommit({})

      const mappedCommit = fromIsomorphicGitCommit(isomorphicGitCommit)

      expect(mappedCommit).toEqual(createCommit({}))
    })
  })
})
