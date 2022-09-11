import { fromUnixTime } from 'date-fns'
import { CommitObject } from 'isomorphic-git'

export type CommitAuthor = {
  name: string
  email: string
  writtenAt: Date
}

export const createCommitAuthor = (a: Partial<CommitAuthor>): CommitAuthor => ({
  name: 'test author',
  email: 'author@test.com',
  writtenAt: fromUnixTime(123),
  ...a,
})

export type FromIsomorphicGitAuthor = (
  a: CommitObject['author']
) => CommitAuthor
export const fromIsomorphicGitAuthor: FromIsomorphicGitAuthor = (a) => ({
  name: a.name,
  email: a.email,
  writtenAt: fromUnixTime(a.timestamp),
})

export const createIsomorphicAuthor = (
  a: Partial<CommitObject['author']>
): CommitObject['author'] => ({
  name: 'test author',
  email: 'author@test.com',
  timestamp: 123,
  timezoneOffset: 123,
  ...a,
})
