import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/function'

import { FunFact } from '../../..'

export const getFreshnessRelativeToOtherProjectsFunFact = (): FunFact => ({
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
          label: NES.unsafeFromString('% of projects abandoned (0.1 = 10%)'),
          data: [0.16, 0.22, 0.38, 0.4, 0.44, 0.58, 0.7, 0.82, 0.99, 1, 1, 1],
        },
        {
          type: 'bar',
          label: NES.unsafeFromString('This project'),
          data: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    }),
  },
})
