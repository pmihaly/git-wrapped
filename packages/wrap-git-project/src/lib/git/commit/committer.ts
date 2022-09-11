import { fromUnixTime } from 'date-fns'
import { CommitObject } from 'isomorphic-git'

import { createIsomorphicAuthor } from '.'

export type Committer = {
  name: string
  email: string
  committedAt: Date
}

export const createCommitter = (a: Partial<Committer>): Committer => ({
  name: 'test committer',
  email: 'committer@test.com',
  committedAt: fromUnixTime(123),
  ...a,
})

export type FromIsomorphicGitCommitter = (
  a: CommitObject['committer']
) => Committer
export const fromIsomorphicGitCommitter: FromIsomorphicGitCommitter = (a) => ({
  name: a.name,
  email: a.email,
  committedAt: fromUnixTime(a.timestamp),
})

export const createIsomorphicCommitter = (
  c: Partial<CommitObject['committer']>
): CommitObject['committer'] => ({
  ...createIsomorphicAuthor({
    name: 'test committer',
    email: 'committer@test.com',
  }),
  ...c,
})
