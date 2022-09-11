import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { constant, identity, pipe } from 'fp-ts/function'
import * as git from 'isomorphic-git'
import { PromiseFsClient } from 'isomorphic-git'

import { Commit, fromIsomorphicGitCommit } from '.'

export type GitInteractor = {
  log: () => TE.TaskEither<string, ReadonlyArray<Commit>>
}

export type IsomorphicGit = typeof git

export type FromIsomorphicGit = (
  ig: IsomorphicGit
) => (fs: PromiseFsClient) => (gitDir: string) => GitInteractor

export const fromIsomorphicGit: FromIsomorphicGit =
  (isomorphicGit) => (fs) => (gitDir) => ({
    log: constant(
      pipe(
        TE.tryCatch(
          constant(isomorphicGit.log({ fs, gitdir: gitDir })),
          String
        ),
        TE.bimap(identity, RA.map(fromIsomorphicGitCommit))
      )
    ),
  })
