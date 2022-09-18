import { differenceInDays, formatDistance, formatISO9075 } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as S from 'fp-ts-std/String'
import * as IOO from 'fp-ts/IOOption'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/function'
import { get } from 'spectacles-ts'

import {
  DayRangesToFreshness,
  calculateProjectFreshness,
  freshnessOfOss,
  getGenerationsOfBananasOutlivedFunFact,
} from '.'
import { CreateStatisticFrom } from '../..'
import { GitRepo } from '../../..'

export type ProjectFreshnessByLastCommitDate = CreateStatisticFrom<GitRepo>
export const projectFreshnessByLastCommitDate =
  (dayRangesToFreshness: DayRangesToFreshness) =>
  (currentDate: Date): ProjectFreshnessByLastCommitDate =>
    flow(
      IOO.of,
      IOO.bindTo('repo'),
      IOO.bind('lastCommit', ({ repo }) => pipe(repo.commits, RA.last, IOO.fromOption)),
      IOO.bind('lastCommittedAt', ({ lastCommit }) => pipe(lastCommit, get('committer.committedAt'), IOO.of)),
      IOO.bind('lastCommitterName', ({ lastCommit }) => pipe(lastCommit, get('committer.name'), IOO.of)),
      IOO.bind('projectFreshness', ({ lastCommittedAt }) =>
        pipe(calculateProjectFreshness(dayRangesToFreshness)(currentDate)(lastCommittedAt), IOO.fromOption)
      ),
      IOO.bind('daysSinceLastCommit', ({ lastCommittedAt }) => IOO.of(differenceInDays(currentDate, lastCommittedAt))),
      IOO.chain(({ lastCommitterName, lastCommittedAt, daysSinceLastCommit, projectFreshness }) =>
        IOO.of({
          name: NES.unsafeFromString('Project freshness by last commit date'),
          headline: NES.unsafeFromString(`Your project is **${projectFreshness.claim}**`),
          text: pipe(
            `Source: ${projectFreshness.source}, `,
            S.append('last committed '),
            S.append(`**${formatDistance(lastCommittedAt, currentDate, { addSuffix: true })}** `),
            S.append(`by ${lastCommitterName}. `),
            S.append(`*(as of ${formatISO9075(currentDate)})*`),
            NES.fromString
          ),
          funFacts: [getGenerationsOfBananasOutlivedFunFact(daysSinceLastCommit), freshnessOfOss],
        })
      )
    )
