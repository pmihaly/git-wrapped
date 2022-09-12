import * as O from 'fp-ts/Option'

import { calculateProjectFreshness, projectFreshnessByLastCommitDate } from '.'
import { createFakeCommit, createFakeCommitter, createFakeGitRepo } from '../../git'

describe('ProjectFreshnessByLastCommitDate', () => {
  describe('calculateProjectFreshness', () => {
    it('should calculate freshness matching the range', () => {
      const daysToFreshness = [
        { range: { min: 0, max: 1 }, label: 'too fresh' },
        { range: { min: 2, max: 4 }, label: 'just right' },
        { range: { min: 5, max: 100 }, label: 'too stale' },
      ]

      const currentDate = new Date(2012, 1, 4)
      const lastCommitDate = new Date(2012, 1, 1)

      const freshness = calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

      expect(freshness).toStrictEqual(O.some('just right'))
    })

    it('should return none when has no matching range', () => {
      const daysToFreshness = [
        { range: { min: 0, max: 1 }, label: 'too fresh' },
        { range: { min: 2, max: 4 }, label: 'just right' },
        { range: { min: 5, max: 100 }, label: 'too stale' },
      ]

      const currentDate = new Date(2012, 1, 1)
      const lastCommitDate = new Date(2012, 5, 31) // may 5 - jan 1 = 150 days

      const freshness = calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

      expect(freshness).toStrictEqual(O.none)
    })
  })

  describe('projectFreshnessByLastCommitDate', () => {
    it('should calculate freshness', () => {
      const project = createFakeGitRepo({
        commits: [
          createFakeCommit({
            committer: createFakeCommitter({
              committedAt: new Date(2022, 9, 10),
            }),
          }),
        ],
      })

      const freshnessStatistic = projectFreshnessByLastCommitDate(new Date(2022, 9, 12))(project)
      expect(O.isSome(freshnessStatistic)).toBe(true)
    })

    it('should not calculate freshness of projects without commits', () => {
      const project = createFakeGitRepo({
        commits: [],
      })

      const freshnessStatistic = projectFreshnessByLastCommitDate(new Date(2022, 9, 12))(project)
      expect(O.isNone(freshnessStatistic)).toBe(true)
    })

    it('should not calculate freshness of projects where no freshness is defined', () => {
      const project = createFakeGitRepo({
        commits: [
          createFakeCommit({
            committer: createFakeCommitter({
              committedAt: new Date(1000, 9, 10),
            }),
          }),
        ],
      })

      const freshnessStatistic = projectFreshnessByLastCommitDate(new Date(2022, 9, 12))(project)
      expect(O.isNone(freshnessStatistic)).toBe(true)
    })
  })
})
