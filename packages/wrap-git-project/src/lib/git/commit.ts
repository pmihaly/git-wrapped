import { fromUnixTime } from 'date-fns'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import { CommitObject, ReadCommitResult } from 'isomorphic-git'

export type Commit = {
  hash: Sha1ObjectId
  message: CommitMessage
  tree: Sha1ObjectId
  parent: ReadonlyArray<Sha1ObjectId>
  author: CommitAuthor
  committer: Committer
  gpgSignature: O.Option<string>
}

export type FromIsomorphicGitCommit = (c: ReadCommitResult) => Commit
export const fromIsomorphicGitCommit: FromIsomorphicGitCommit = (c) => ({
  hash: c.oid,
  message: c.commit.message,
  tree: c.commit.tree,
  parent: c.commit.parent,
  author: fromIsomorphicGitAuthor(c.commit.author),
  committer: fromIsomorphicGitCommitter(c.commit.committer),
  gpgSignature: O.fromPredicate(S.isString)(c.commit.gpgsig),
})

export const createIsomorphicCommit = (
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

export type Sha1ObjectId = string

export type CommitMessage = string

export type CommitAuthor = {
  name: string
  email: string
  writtenAt: Date
}

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

export type Committer = {
  name: string
  email: string
  committedAt: Date
}

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
