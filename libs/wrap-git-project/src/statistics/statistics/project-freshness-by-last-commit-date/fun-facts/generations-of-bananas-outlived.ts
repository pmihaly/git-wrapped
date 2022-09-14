import * as NES from 'fp-ts-std/NonEmptyString'
import * as NS from 'fp-ts-std/Number'
import * as O from 'fp-ts/Option'

import { FunFact } from '../../..'

export const getGenerationsOfBananasOutlivedFunFact = (daysSinceLastCommit: number): FunFact => ({
  claim: {
    headline: NES.fromString(`A banana's shelf life in the fridge is about **7–10 days**`),
    text: NES.fromString(
      `Your project outlives at least ${NS.divide(10)(daysSinceLastCommit).toFixed(1)} refrigerated banana-generations.`
    ),
    chart: O.none,
  },
  source: NES.unsafeFromString('https://www.doesitgobad.com/banana-go-bad'),
})
