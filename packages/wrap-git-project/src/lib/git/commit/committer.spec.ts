import { createIsomorphicCommitter, fromIsomorphicGitCommitter } from '.'

describe('Committer', () => {
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
