import { Commit, createCommit } from '.'

export type GitRepo = {
  commits: ReadonlyArray<Commit>
}

export const createStubGitRepo = (g: Partial<GitRepo>): GitRepo => ({
  commits: [
    createCommit({ message: 'commit 1' }),
    createCommit({ message: 'commit 2' }),
  ],
  ...g,
})
