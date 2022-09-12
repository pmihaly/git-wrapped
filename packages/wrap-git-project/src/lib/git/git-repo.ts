import { Commit, createCommit } from '.'

export type GitRepo = {
  commits: ReadonlyArray<Commit>
}
