import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'

import { DayRangesToFreshness, calculateProjectFreshness, projectFreshnessByLastCommitDate } from '.'
import { createFakeCommit, createFakeCommitter, createFakeGitRepo } from '../../../git'

describe('ProjectFreshnessByLastCommitDate', () => {
  describe('calculateProjectFreshness', () => {
    it('should calculate freshness matching the range', () => {
      const daysToFreshness: DayRangesToFreshness = [
        {
          range: { min: 0, max: 1 },
          freshness: {
            claim: NES.unsafeFromString('too fresh'),
            source: NES.unsafeFromString('source 1'),
          },
        },
        {
          range: { min: 2, max: 4 },
          freshness: {
            claim: NES.unsafeFromString('just right'),
            source: NES.unsafeFromString('source 2'),
          },
        },
        {
          range: { min: 5, max: 100 },
          freshness: {
            claim: NES.unsafeFromString('just right'),
            source: NES.unsafeFromString('source 3'),
          },
        },
      ]

      const currentDate = new Date(2012, 1, 4)
      const lastCommitDate = new Date(2012, 1, 1)

      const freshness = calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

      expect(O.isSome(freshness)).toBe(true)
    })

    it('should return none when has no matching range', () => {
      const daysToFreshness: DayRangesToFreshness = [
        {
          range: { min: 0, max: 1 },
          freshness: {
            claim: NES.unsafeFromString('too fresh'),
            source: NES.unsafeFromString('source 1'),
          },
        },
        {
          range: { min: 2, max: 4 },
          freshness: {
            claim: NES.unsafeFromString('just right'),
            source: NES.unsafeFromString('source 2'),
          },
        },
        {
          range: { min: 5, max: 100 },
          freshness: {
            claim: NES.unsafeFromString('just right'),
            source: NES.unsafeFromString('source 3'),
          },
        },
      ]
      const currentDate = new Date(2012, 1, 1)
      const lastCommitDate = new Date(2012, 5, 31) // may 5 - jan 1 = 150 days

      const freshness = calculateProjectFreshness(daysToFreshness)(currentDate)(lastCommitDate)

      expect(O.isNone(freshness)).toBe(true)
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

      const dayRangesToFreshness: DayRangesToFreshness = [
        {
          range: { min: 0, max: 14 },
          freshness: {
            claim: NES.unsafeFromString('test'),
            source: NES.unsafeFromString('source 1'),
          },
        },
      ]

      const freshnessStatistic = projectFreshnessByLastCommitDate(dayRangesToFreshness)(new Date(2022, 9, 12))(project)
      expect(O.isSome(freshnessStatistic())).toBe(true)
    })

    it('should not calculate freshness of projects without commits', () => {
      const project = createFakeGitRepo({
        commits: [],
      })

      const dayRangesToFreshness: DayRangesToFreshness = [
        {
          range: { min: 0, max: 14 },
          freshness: {
            claim: NES.unsafeFromString('test'),
            source: NES.unsafeFromString('source 1'),
          },
        },
      ]

      const freshnessStatistic = projectFreshnessByLastCommitDate(dayRangesToFreshness)(new Date(2022, 9, 12))(project)
      expect(O.isNone(freshnessStatistic())).toBe(true)
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

      const dayRangesToFreshness: DayRangesToFreshness = [
        {
          range: { min: 0, max: 14 },
          freshness: {
            claim: NES.unsafeFromString('test'),
            source: NES.unsafeFromString('source 1'),
          },
        },
      ]

      const freshnessStatistic = projectFreshnessByLastCommitDate(dayRangesToFreshness)(new Date(2022, 9, 12))(project)
      expect(O.isNone(freshnessStatistic())).toBe(true)
    })
  })
})
