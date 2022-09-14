# Git Wrapped

## TODO

- [x] collect possibly all git repo related statistics in a `ReadonlyNonEmptyArray<IO<CreateStatisticFrom<GitRepo>>>` or similar type and calculate them all on a single git repo
- [ ] initialize frontend projects

  - using https://github.com/sevenwestmedia-labs/nx-plugins/tree/main/libs/nx-vite

- [ ] freshness by last commit statistic: bar representing the repo should be on the last completed month

## File structure

- app/wrap-git-project - passes runtime to wrap-git-project-cli
  - lib/wrap-git-project-cli - provides a CLI to wrap-git-project
  - lib/wrap-git-project - functions to wrap a git project
- app/present-wrapped-project - routes URLS and provides statistics from a file to pages defined in present-wrapped-project
  - lib/present-wrapped-project-logic - hooks and pages/components which receive components UI as props
  - lib/present-wrapped-project-ui - components visible by an end user
