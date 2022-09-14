import { differenceInDays, formatDistance, formatISO9075 } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as S from 'fp-ts-std/String'
import * as IOO from 'fp-ts/IOOption'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, flow, pipe } from 'fp-ts/function'
import { get } from 'spectacles-ts'

import { DayRangesToFreshness, buildProjectInactivityRelativeToOtherProjects, calculateProjectFreshness } from '.'
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
          headline: NES.unsafeFromString(`Your project is **${projectFreshness.label}**`),
          description: O.of(
            buildDescription({ prefix: projectFreshness.description, lastCommitterName, lastCommittedAt, currentDate })
          ),
          funFacts: projectFreshness.buildFunFacts({ daysSinceLastCommit }),
          charts: [buildProjectInactivityRelativeToOtherProjects()],
        })
      )
    )

export const buildDescription = ({
  prefix,
  lastCommittedAt,
  currentDate,
  lastCommitterName,
}: {
  prefix: O.Option<NES.NonEmptyString>
  lastCommittedAt: Date
  currentDate: Date
  lastCommitterName: string
}): NES.NonEmptyString =>
  pipe(
    prefix,
    O.match(constant(''), NES.toString),
    S.append(O.match(constant('L'), constant(', l'))(prefix)),
    S.append('ast committed '),
    S.append(`**${formatDistance(lastCommittedAt, currentDate, { addSuffix: true })}** `),
    S.append(`by ${lastCommitterName} `),
    S.append(`*(as of ${formatISO9075(currentDate)})*`),
    NES.unsafeFromString
  )
