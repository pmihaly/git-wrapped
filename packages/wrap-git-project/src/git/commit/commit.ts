import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import { ReadCommitResult } from 'isomorphic-git'

import {
  CommitAuthor,
  Committer,
  createFakeCommitAuthor,
  createFakeCommitter,
  createFakeIsomorphicAuthor,
  createFakeIsomorphicCommitter,
  fromIsomorphicGitAuthor,
  fromIsomorphicGitCommitter,
} from '.'

export type Sha1ObjectId = string
export type CommitMessage = string

export type Commit = {
  hash: Sha1ObjectId
  message: CommitMessage
  tree: Sha1ObjectId
  parent: ReadonlyArray<Sha1ObjectId>
  author: CommitAuthor
  committer: Committer
  gpgSignature: O.Option<string>
}

export const createFakeCommit = (c: Partial<Commit>): Commit => ({
  hash: 'test oid',
  message: 'commit message',
  tree: 'commit tree',
  parent: ['parent1', 'parent2'],
  gpgSignature: O.some('gpg signature'),
  author: createFakeCommitAuthor({}),
  committer: createFakeCommitter({}),
  ...c,
})

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

export const createFakeIsomorphicCommit = (c: Partial<ReadCommitResult>): ReadCommitResult => ({
  oid: 'test oid',
  commit: {
    message: 'commit message',
    tree: 'commit tree',
    parent: ['parent1', 'parent2'],
    author: createFakeIsomorphicAuthor({}),
    committer: createFakeIsomorphicCommitter({}),
    gpgsig: 'gpg signature',
  },
  payload: 'gpg payload',
  ...c,
})
