import { differenceInDays, formatDistance, intlFormat } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as S from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { get } from 'spectacles-ts'

import { DayRangesToFreshness, calculateProjectFreshness } from '.'
import { Chart, CreateStatisticFrom, WithSource } from '../..'
import { GitRepo } from '../../..'

const buildProjectInactivityRelativeToOtherProjects = (_: number): WithSource<Chart> => ({
  source: NES.unsafeFromString(
    'Kalliamvakou, Eirini & Gousios, Georgios & Blincoe, Kelly & Singer, Leif & German, Daniel & Damian, Daniela. (2015). The Promises and Perils of Mining GitHub (Extended Version). Empirical Software Engineering.'
  ),
  claim: {
    type: 'area',
    labels: pipe(
      '<1',
      RNEA.of,
      RNEA.concat(['<2', '<3', '<4', '<5', '<6', '<9', '<12', '<24', '<36', '<48', '<60']),
      RNEA.map(NES.unsafeFromString)
    ),
    datasets: [{ data: pipe(0.16, RNEA.of, RNEA.concat([0.22, 0.38, 0.4, 0.44, 0.58, 0.7, 0.82, 0.99, 1, 1, 1])) }],
  },
})

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
          charts: [buildProjectInactivityRelativeToOtherProjects(daysSinceLastCommit)],
        })
      )
    )
