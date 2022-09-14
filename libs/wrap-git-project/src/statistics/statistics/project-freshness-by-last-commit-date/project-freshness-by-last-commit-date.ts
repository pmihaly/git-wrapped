import { differenceInDays, formatDistance, formatISO9075 } from 'date-fns'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as S from 'fp-ts-std/String'
import * as IOO from 'fp-ts/IOOption'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { flow, pipe } from 'fp-ts/function'
import { get } from 'spectacles-ts'

import { DayRangesToFreshness, calculateProjectFreshness, getGenerationsOfBananasOutlivedFunFact } from '.'
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
          text: pipe(
            'Last committed ',
            S.append(`**${formatDistance(lastCommittedAt, currentDate, { addSuffix: true })}** `),
            S.append(`by ${lastCommitterName}. `),
            S.append(`*(as of ${formatISO9075(currentDate)})*`),
            NES.fromString
          ),
          funFacts: [
            getGenerationsOfBananasOutlivedFunFact(daysSinceLastCommit),
            {
              source: NES.unsafeFromString(
                'Kalliamvakou, Eirini & Gousios, Georgios & Blincoe, Kelly & Singer, Leif & German, Daniel & Damian, Daniela. (2015). The Promises and Perils of Mining GitHub (Extended Version). Empirical Software Engineering.'
              ),
              claim: {
                headline: O.none,
                text: O.none,
                chart: O.some({
                  labels: pipe(
                    ['<1', '<2', '<3', '<4', '<5', '<6', '<9', '<12', '<24', '<36', '<48', '<60'],
                    RNEA.map(NES.unsafeFromString)
                  ),
                  datasets: [
                    {
                      type: 'area',
                      label: O.of(NES.unsafeFromString('% of projects abandoned (0.1 = 10%)')),
                      data: [0.16, 0.22, 0.38, 0.4, 0.44, 0.58, 0.7, 0.82, 0.99, 1, 1, 1],
                    },
                    {
                      type: 'bar',
                      label: O.of(NES.unsafeFromString('This project')),
                      data: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    },
                  ],
                }),
              },
            },
          ],
        })
      )
    )
