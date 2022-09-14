# Git Wrapped

## TODO

- [x] collect possibly all git repo related statistics in a `ReadonlyNonEmptyArray<IO<CreateStatisticFrom<GitRepo>>>` or similar type and calculate them all on a single git repo
- [x] initialize frontend projects
- [ ] Adding `Task<>` to statistics
- [ ] Statistic should only have a name, a headline and a RNEA of funFacts

  - funFact: optional headline, optional text, optional chart

- Pages:
  - [ ] Welcome
  - [ ] Statistic
    - Headline
    - FunFact
  - [ ] Thanks

## TODO Statistics

- [ ] fixme: freshness by last commit statistic: bar representing the repo should be on the last completed month
- [ ] numbers and instances of profanities in commit messages and/or diffs
  - diffs in a commit
  - highlightCommits (Commit[]) in a FunFact
- [ ] night owl vs early bird
- [ ] conventional commits
  - ratio between feat, fix, refactor, etc types and also compared to average projects - only if all commits follow the conventional commit style
  - barchart of scopes
  - instances of breaking changes

## File structure

- app/wrap-git-project - passes runtime to wrap-git-project-cli
  - lib/wrap-git-project-cli - provides a CLI to wrap-git-project
  - lib/wrap-git-project - functions to wrap a git project
- app/present-wrapped-project - routes URLS and provides statistics from a file to pages defined in present-wrapped-project
  - lib/present-wrapped-project-logic - hooks and pages/components which receive components UI as props
  - lib/present-wrapped-project-ui - components visible by an end user
