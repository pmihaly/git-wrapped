import { differenceInDays } from 'date-fns'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'

export type CalculateProjectFreshness = (
  dayRangesToFreshness: ReadonlyArray<{
    range: { min: number; max: number }
    label: string
  }>
) => (currentDate: Date) => (lastCommitDate: Date) => O.Option<string>
export const calculateProjectFreshness: CalculateProjectFreshness =
  (dayRangesToFreshness) => (currentDate) => (lastCommitDate) =>
    pipe(
      dayRangesToFreshness,
      RA.findFirstMap(({ range: { min, max }, label: s }) =>
        RA.elem(N.Eq)(differenceInDays(currentDate, lastCommitDate))(
          RNEA.range(min, max)
        )
          ? O.some(s)
          : O.none
      )
    )
