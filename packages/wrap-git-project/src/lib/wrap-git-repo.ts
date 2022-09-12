import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { apply, pipe } from 'fp-ts/function'

import { CreateStatisticFrom, GitRepo, Statistic } from '.'

export type WrapGitRepo = (
  r: GitRepo
) => (
  s: RNEA.ReadonlyNonEmptyArray<CreateStatisticFrom<GitRepo>>
) => ReadonlyArray<Statistic>

export const wrapGitRepo: WrapGitRepo = (repo) => (stats) =>
  pipe(stats, RNEA.map(apply(repo)), RA.compact)
