# Git Wrapped

## TODO

- [x] collect possibly all git repo related statistics in a `ReadonlyNonEmptyArray<IO<CreateStatisticFrom<GitRepo>>>` or similar type and calculate them all on a single git repo
- [x] initialize frontend projects
- [ ] Adding `Task<>` to statistics
- [x] Statistic should only have a name, a headline and a RNEA of funFacts

  - funFact: optional headline, optional text, optional chart

- Pages:

  - [ ] Welcome
  - [ ] Statistic
    - Headline
    - FunFact
  - [ ] Thanks

- Style
  - Random color (randomly picks dark or light theme, randomly picks a color from netxui palette to use as a 'primary' color)
  - Blurred & animated blob background
    - Randomly picked by the primary color from https://app.haikei.app/ + blur
  - Confetti
    - Statistics have an optional achievementHeadline, congratulating the user for an achievement - "You have successfully resisted the urge to swear in 80% of commit messages"
    - Statistics with achievementHeadline can be displayed with confettis
    - Frontend randomly picks X% of confetti enabled statistics and merges them evenly with nonConfettiStats:
      `mergeEvenly nonConfettiStats confettiStats = zipWith (flatten . RA.append) (chunksOf (size confettiStats) nonConfettiStats) (RA.of confettiStats)`
    - https://www.npmjs.com/package/react-canvas-confetti with "Realistic" example or https://www.npmjs.com/package/react-confetti-explosion
  - Parallax tilt effect on charts https://www.npmjs.com/package/react-parallax-tilt
  - https://www.npmjs.com/package/react-locomotive-scroll

## TODO Statistics

- [ ] fixme: freshness by last commit statistic: bar representing the repo should be on the last completed month
- [ ] numbers and instances of profanities in commit messages and/or diffs
  - diffs in a commit
  - highlightCommits (Commit[]) in a FunFact
- [ ] numbers and instances of typos in commit messages and/or diffs
- [ ] night owl vs early bird (who is the most expreme night out/early bird (multiple committer) or is the author a night owl/early bird (single committer))
- [ ] conventional commits
  - ratio between feat, fix, refactor, etc types and also compared to average projects - only if all commits follow the conventional commit style
  - piechart of scopes
  - instances of breaking changes

## File structure

- app/wrap-git-project - passes runtime to wrap-git-project-cli
  - lib/wrap-git-project-cli - provides a CLI to wrap-git-project
  - lib/wrap-git-project - functions to wrap a git project
- app/present-wrapped-project - routes URLS and provides statistics from a file to pages defined in present-wrapped-project
  - lib/present-wrapped-project-logic - hooks and pages/components which receive components UI as props
  - lib/present-wrapped-project-ui - components visible by an end user
