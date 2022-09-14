import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import { constant } from 'fp-ts/function'

import { DayRangesToFreshness, buildDescription, calculateProjectFreshness, projectFreshnessByLastCommitDate } from '.'
import { createFakeCommit, createFakeCommitter, createFakeGitRepo } from '../../../git'

describe('ProjectFreshnessByLastCommitDate', () => {
  describe('calculateProjectFreshness', () => {
    it('should calculate freshness matching the range', () => {
      const daysToFreshness: DayRangesToFreshness = [
        {
          range: { min: 0, max: 1 },
          freshness: {
            label: NES.unsafeFromString('too fresh'),
            description: O.none,
            buildFunFacts: () => [],
            charts: [],
          },
        },
        {
          range: { min: 2, max: 4 },
          freshness: {
            label: NES.unsafeFromString('just right'),
            description: O.none,
            buildFunFacts: () => [],
            charts: [],
          },
        },
        {
          range: { min: 5, max: 100 },
          freshness: {
            label: NES.unsafeFromString('just right'),
            description: O.none,
            buildFunFacts: () => [],
            charts: [],
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
            label: NES.unsafeFromString('too fresh'),
            description: O.none,
            buildFunFacts: () => [],
            charts: [],
          },
        },
        {
          range: { min: 2, max: 4 },
          freshness: {
            label: NES.unsafeFromString('just right'),
            description: O.none,
            buildFunFacts: () => [],
            charts: [],
          },
        },
        {
          range: { min: 5, max: 100 },
          freshness: {
            label: NES.unsafeFromString('just right'),
            description: O.none,
            buildFunFacts: () => [],
            charts: [],
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
            label: NES.unsafeFromString('test'),
            description: O.none,
            buildFunFacts: constant([]),
            charts: [],
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
            label: NES.unsafeFromString('test'),
            description: O.none,
            buildFunFacts: constant([]),
            charts: [],
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
            label: NES.unsafeFromString('test'),
            description: O.none,
            buildFunFacts: constant([]),
            charts: [],
          },
        },
      ]

      const freshnessStatistic = projectFreshnessByLastCommitDate(dayRangesToFreshness)(new Date(2022, 9, 12))(project)
      expect(O.isNone(freshnessStatistic())).toBe(true)
    })
  })

  describe('buildDescription', () => {
    it('should build full description', () => {
      const options = {
        prefix: O.of(NES.unsafeFromString('Test prefix')),
        lastCommittedAt: new Date('2022-09-13 18:00:00'),
        currentDate: new Date('2022-09-13 18:06:00'),
        lastCommitterName: 'committer',
      }

      const description = NES.toString(buildDescription(options))

      expect(description).toBe(
        'Test prefix, last committed **6 minutes ago** by committer *(as of 2022-09-13 18:06:00)*'
      )
    })
  })

  it('should leave out prefix if not given', () => {
    const options = {
      prefix: O.none,
      lastCommittedAt: new Date('2022-09-13 18:00:00'),
      currentDate: new Date('2022-09-13 18:06:00'),
      lastCommitterName: 'committer',
    }

    const description = NES.toString(buildDescription(options))

    expect(description).toBe('Last committed **6 minutes ago** by committer *(as of 2022-09-13 18:06:00)*')
  })
})