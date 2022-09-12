import { Commit, createFakeCommit } from '.'

export type GitRepo = {
  commits: ReadonlyArray<Commit>
}

export const createFakeGitRepo = (g: Partial<GitRepo>): GitRepo => ({
  commits: [
    createFakeCommit({ message: 'commit 1' }),
    createFakeCommit({ message: 'commit 2' }),
  ],
  ...g,
})
