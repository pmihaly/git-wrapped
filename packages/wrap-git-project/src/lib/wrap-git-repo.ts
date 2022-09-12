import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { apply, flow } from 'fp-ts/function'

import { CreateStatisticFrom, GitRepo, Statistic } from '.'

export type WrapGitRepo = (
  r: GitRepo
) => (s: RNEA.ReadonlyNonEmptyArray<CreateStatisticFrom<GitRepo>>) => ReadonlyArray<Statistic>

export const wrapGitRepo: WrapGitRepo = (repo) => flow(RNEA.map(apply(repo)), RA.compact)
