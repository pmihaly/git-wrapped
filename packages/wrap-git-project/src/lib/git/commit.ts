import { CommitObject, ReadCommitResult } from 'isomorphic-git'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import { fromUnixTime } from 'date-fns'

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
