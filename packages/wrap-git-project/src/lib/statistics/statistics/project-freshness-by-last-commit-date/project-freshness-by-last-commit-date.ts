import { differenceInDays, formatDistance, intlFormat } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as S from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, flow, pipe } from 'fp-ts/function'
import { get } from 'spectacles-ts'

import { DayRangesToFreshness, calculateProjectFreshness } from '.'
import { CreateStatisticFrom } from '../..'
import { GitRepo } from '../../..'

export type ProjectFreshnessByLastCommitDate = CreateStatisticFrom<GitRepo>
export const projectFreshnessByLastCommitDate =
  (dayRangesToFreshness: DayRangesToFreshness) =>
  (currentDate: Date): ProjectFreshnessByLastCommitDate =>
    flow(
      O.of,
      O.bindTo('repo'),
      O.bind('lastCommit', ({ repo }) => pipe(repo.commits, RA.last)),
      O.bind('lastCommittedAt', ({ lastCommit }) => pipe(lastCommit, get('committer.committedAt'), O.of)),
      O.bind('lastCommitterName', ({ lastCommit }) => pipe(lastCommit, get('committer.name'), O.of)),
      O.bind('projectFreshness', ({ lastCommittedAt }) =>
        calculateProjectFreshness(dayRangesToFreshness)(currentDate)(lastCommittedAt)
      ),
      O.bind('daysSinceLastCommit', ({ lastCommittedAt }) => O.of(differenceInDays(currentDate, lastCommittedAt))),
      O.chain(({ lastCommitterName, lastCommittedAt, daysSinceLastCommit, projectFreshness }) =>
        O.of({
          name: NES.unsafeFromString('Project freshness by last commit date'),
          headline: NES.unsafeFromString(`Your project is **${projectFreshness.label}**`),
          description: O.of(
            NES.unsafeFromString(
              `${O.match(
                constant('L'),
                flow(NES.toString, S.append(', l'))
              )(projectFreshness.description)}ast committed **${formatDistance(lastCommittedAt, currentDate, {
                addSuffix: true,
              })}** by ${lastCommitterName} *(as of ${intlFormat(currentDate)})*`
            )
          ),
          funFacts: projectFreshness.buildFunFacts({ daysSinceLastCommit }),
          charts: [],
        })
      )
    )
