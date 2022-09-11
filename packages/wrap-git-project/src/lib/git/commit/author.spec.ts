import { createIsomorphicAuthor, fromIsomorphicGitAuthor } from '.'

describe('Author', () => {
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
})
